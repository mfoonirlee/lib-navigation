;(function(win, lib, undef){

var document = win.document;
var location = win.location;
var history = win.history;
var ua = win.navigator.userAgent;
var Firefox = !!ua.match(/Firefox/i);
var IEMobile = !!ua.match(/IEMobile/i);
// var isIEMobile = win.navigator.userAgent.match(/IEMobile\/([\d\.]+)/);

!history.state && history.replaceState && history.replaceState(true, null); // 先重置一次state，可以通过history.state来判断手机是否正常支持    

function Params(args) {
    args = args || '';

    var that = this;
    var params = {};
    if (args && typeof args === 'string') {
        var s1 = args.split('&');
        for (var i = 0; i < s1.length; i++) {
            var s2 = s1[i].split('=');
            params[decodeURIComponent(s2[0])] = decodeURIComponent(s2[1]);
        }
    } else if (typeof args === 'object') {
        for (var key in args) {
            params[key] = args[key];
        }
    }

    for (var key in params) {
        (function(prop){
            Object.defineProperty(that, prop, {
                get: function() {
                    return params[prop];
                },
                set: function(v) {
                    params[prop] = v;
                },
                enumerable: true
            });
        })(key);
    }

    this.toString = function() {
        return Object.keys(params).sort().map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
    }
}

var requestAnimationFrame = window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            function(cb) {
                setTimeout(cb, 1 /60);
            };

function Navigation(){
    var that = this;
    var executerQueue = [];
    var useHistoryState = !!history.state;
    var historyStorage = {
        //stack: []
    };
    var action = 'initial';

    function dispatchAnchorEvent(href) {
        var a = document.createElement('a');
        a.href = href;
        a.style.cssText = 'display:none;';
        document.body.appendChild(a);

        var e;
        if (win['MouseEvent']) {
            e = new MouseEvent('click', {
                view: window,
                bubbles: false,
                cancelable: false
            });
        } else {
            e = document.createEvent('HTMLEvents');
            e.initEvent('click', false, false);    
        }
        
        if (e) {
            a.dispatchEvent(e);    
        } else {
            location.href = href;
        }
        
    }

    function dispatchWindowEvent(name, extra) {
        var ev = document.createEvent('HTMLEvents');
        ev.initEvent(name, false, false);
        if (extra) {
            for (var key in extra) {
                ev[key] = extra[key];
            }
        }
        window.dispatchEvent(ev);
    }

    function PushExecuter(state, step){
        this.exec = function(){
            //historyStorage.stack.push(state);
            dispatchWindowEvent('navigation:push');
        }
    }

    function PopExecuter(state, step){
        this.exec = function(){
            // for (var i = 0; i > step; i--) {
            //     historyStorage.stack.pop();
            // }
            dispatchWindowEvent('navigation:pop');
        }
    }

    function ReplaceExecuter(state){
        this.exec = function(){
            // historyStorage.stack.pop();
            // historyStorage.stack.push(state);
            dispatchWindowEvent('navigation:replace');
        }
    }

    executerQueue.exec = function() {
        if (executerQueue.length) {
            executerQueue.shift().exec();
        }
    }

    function isSameState(state1, state2) {
        return state1.name === state2.name && state1.args.toString() === state2.args.toString();
    }

    this.push = function(path, args){
        var state = {
            name: path,
            args: new Params(args),
            id: historyStorage.state.id + 1
        };

        if (isSameState(state, historyStorage.state)) return;

        action = 'push';
        var search = state.args.toString();
        if (useHistoryState) {
            var hash = '#' + state.name + (search?'?' + search:'');
            history.pushState({
                name: state.name,
                args: search,
                id: state.id
            }, null, hash);
            dispatchWindowEvent('pushstate');
        } else {
            var hash = '#' + state.name + '[' + state.id + ']' + (search?'?' + search:'');
            dispatchAnchorEvent(hash);
        }
    }

    this.pop = function(){
        if (historyStorage.state.id > 1) {
            action = 'pop';
            history.back();
        }
    }

    this.replace = function(path, args) {
        var state = {
            name: path,
            args: new Params(args),
            id: historyStorage.state.id
        };

        if (isSameState(state, historyStorage.state)) return;

        action = 'replace';
        var search = state.args.toString();
        if (useHistoryState) {
            var hash = '#' + state.name + (search?'?' + search:'');
            history.replaceState({
                name: state.name,
                args: search,
                id: state.id
            }, null, hash);
            dispatchWindowEvent('replacestate');
        } else {
            var hash = '#' + state.name + '[' + state.id + ']' + (search?'?' + search:'');
            dispatchAnchorEvent(hash);
        }
    }

    var isStart = false;
    this.start = function(options) {
        if (isStart) return;
        isStart = true;

        var defaultPath = options.defaultPath || '';
        var defaultArgs = options.defaultArgs || '';
        useHistoryState &= !!options.useHistoryState;

        Object.defineProperty(this, 'useHistoryState', {
            get: function() {
                return useHistoryState;
            }
        });

        Object.defineProperty(this, 'action', {
            get: function() {
                return action;
            }
        });

        Object.defineProperty(this, 'state', {
            get: function() {
                return {
                    id: historyStorage.state.id,
                    name: historyStorage.state.name,
                    args: historyStorage.state.args
                };
            }
        });

        function getState() {
            var state;
            if (useHistoryState && history.state != null && history.state !== true) {
                state = {
                    id: history.state.id,
                    name: history.state.name,
                    args: new Params(history.state.args)
                }
            } else {
                var hash = location.hash;
                var hashMatched = hash.match(/#([^\[\]\?]+)(?:\[(\d+)\])?(?:\?(.*))?/) || ['', defaultPath, 1, defaultArgs];
                state = {
                    name: hashMatched[1],
                    id: parseInt(hashMatched[2] || 1),
                    args: new Params(hashMatched[3] || '')
                }
            }

            return state;
        }

        function stateChange(e) {
            var state = getState();
            var oldstate = historyStorage.state;
            historyStorage.state = state;

            if(state.id < oldstate.id) {
                action = 'pop';
                executerQueue.push(new PopExecuter(state, state.id - oldstate.id));
            } else if (state.id === oldstate.id) {
                if (that.action === 'replace') {
                    executerQueue.push(new ReplaceExecuter(state));
                } else {
                   // 手动改hash的问题 
                   console.error('请勿用location.hash或location.href来改变hash值');
                }
            } else {
                action = 'push';
                executerQueue.push(new PushExecuter(state, state.id - oldstate.id));
            }
            executerQueue.exec();
        }

        var state = getState();
        if (useHistoryState) {
            win.addEventListener('pushstate', stateChange, false);
            win.addEventListener('popstate', stateChange, false);
            win.addEventListener('replacestate', stateChange, false);
        } else {
            win.addEventListener('hashchange', stateChange, false);
        }

        historyStorage.state = state;

        executerQueue.push(new PushExecuter(state));
        executerQueue.exec();
    }
}

lib.navigation = Navigation;

})(window, window['lib'] || (window['lib'] = {}));