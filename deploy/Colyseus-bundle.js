var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/howler/dist/howler.js
var require_howler = __commonJS({
  "node_modules/howler/dist/howler.js"(exports) {
    (function() {
      "use strict";
      var HowlerGlobal2 = function() {
        this.init();
      };
      HowlerGlobal2.prototype = {
        /**
         * Initialize the global Howler object.
         * @return {Howler}
         */
        init: function() {
          var self2 = this || Howler2;
          self2._counter = 1e3;
          self2._html5AudioPool = [];
          self2.html5PoolSize = 10;
          self2._codecs = {};
          self2._howls = [];
          self2._muted = false;
          self2._volume = 1;
          self2._canPlayEvent = "canplaythrough";
          self2._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
          self2.masterGain = null;
          self2.noAudio = false;
          self2.usingWebAudio = true;
          self2.autoSuspend = true;
          self2.ctx = null;
          self2.autoUnlock = true;
          self2._setup();
          return self2;
        },
        /**
         * Get/set the global volume for all sounds.
         * @param  {Float} vol Volume from 0.0 to 1.0.
         * @return {Howler/Float}     Returns self or current volume.
         */
        volume: function(vol) {
          var self2 = this || Howler2;
          vol = parseFloat(vol);
          if (!self2.ctx) {
            setupAudioContext();
          }
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            self2._volume = vol;
            if (self2._muted) {
              return self2;
            }
            if (self2.usingWebAudio) {
              self2.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (!self2._howls[i]._webAudio) {
                var ids = self2._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self2._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.volume = sound._volume * vol;
                  }
                }
              }
            }
            return self2;
          }
          return self2._volume;
        },
        /**
         * Handle muting and unmuting globally.
         * @param  {Boolean} muted Is muted or not.
         */
        mute: function(muted) {
          var self2 = this || Howler2;
          if (!self2.ctx) {
            setupAudioContext();
          }
          self2._muted = muted;
          if (self2.usingWebAudio) {
            self2.masterGain.gain.setValueAtTime(muted ? 0 : self2._volume, Howler2.ctx.currentTime);
          }
          for (var i = 0; i < self2._howls.length; i++) {
            if (!self2._howls[i]._webAudio) {
              var ids = self2._howls[i]._getSoundIds();
              for (var j = 0; j < ids.length; j++) {
                var sound = self2._howls[i]._soundById(ids[j]);
                if (sound && sound._node) {
                  sound._node.muted = muted ? true : sound._muted;
                }
              }
            }
          }
          return self2;
        },
        /**
         * Handle stopping all sounds globally.
         */
        stop: function() {
          var self2 = this || Howler2;
          for (var i = 0; i < self2._howls.length; i++) {
            self2._howls[i].stop();
          }
          return self2;
        },
        /**
         * Unload and destroy all currently loaded Howl objects.
         * @return {Howler}
         */
        unload: function() {
          var self2 = this || Howler2;
          for (var i = self2._howls.length - 1; i >= 0; i--) {
            self2._howls[i].unload();
          }
          if (self2.usingWebAudio && self2.ctx && typeof self2.ctx.close !== "undefined") {
            self2.ctx.close();
            self2.ctx = null;
            setupAudioContext();
          }
          return self2;
        },
        /**
         * Check for codec support of specific extension.
         * @param  {String} ext Audio file extention.
         * @return {Boolean}
         */
        codecs: function(ext) {
          return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
        },
        /**
         * Setup various state values for global tracking.
         * @return {Howler}
         */
        _setup: function() {
          var self2 = this || Howler2;
          self2.state = self2.ctx ? self2.ctx.state || "suspended" : "suspended";
          self2._autoSuspend();
          if (!self2.usingWebAudio) {
            if (typeof Audio !== "undefined") {
              try {
                var test = new Audio();
                if (typeof test.oncanplaythrough === "undefined") {
                  self2._canPlayEvent = "canplay";
                }
              } catch (e) {
                self2.noAudio = true;
              }
            } else {
              self2.noAudio = true;
            }
          }
          try {
            var test = new Audio();
            if (test.muted) {
              self2.noAudio = true;
            }
          } catch (e) {
          }
          if (!self2.noAudio) {
            self2._setupCodecs();
          }
          return self2;
        },
        /**
         * Check for browser support for various codecs and cache the results.
         * @return {Howler}
         */
        _setupCodecs: function() {
          var self2 = this || Howler2;
          var audioTest = null;
          try {
            audioTest = typeof Audio !== "undefined" ? new Audio() : null;
          } catch (err) {
            return self2;
          }
          if (!audioTest || typeof audioTest.canPlayType !== "function") {
            return self2;
          }
          var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
          var ua = self2._navigator ? self2._navigator.userAgent : "";
          var checkOpera = ua.match(/OPR\/(\d+)/g);
          var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
          var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
          var safariVersion = ua.match(/Version\/(.*?) /);
          var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
          self2._codecs = {
            mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
            mpeg: !!mpegTest,
            opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
            aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
            caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
            m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
            flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
          };
          return self2;
        },
        /**
         * Some browsers/devices will only allow audio to be played after a user interaction.
         * Attempt to automatically unlock audio on the first user interaction.
         * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
         * @return {Howler}
         */
        _unlockAudio: function() {
          var self2 = this || Howler2;
          if (self2._audioUnlocked || !self2.ctx) {
            return;
          }
          self2._audioUnlocked = false;
          self2.autoUnlock = false;
          if (!self2._mobileUnloaded && self2.ctx.sampleRate !== 44100) {
            self2._mobileUnloaded = true;
            self2.unload();
          }
          self2._scratchBuffer = self2.ctx.createBuffer(1, 1, 22050);
          var unlock = function(e) {
            while (self2._html5AudioPool.length < self2.html5PoolSize) {
              try {
                var audioNode = new Audio();
                audioNode._unlocked = true;
                self2._releaseHtml5Audio(audioNode);
              } catch (e2) {
                self2.noAudio = true;
                break;
              }
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (!self2._howls[i]._webAudio) {
                var ids = self2._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self2._howls[i]._soundById(ids[j]);
                  if (sound && sound._node && !sound._node._unlocked) {
                    sound._node._unlocked = true;
                    sound._node.load();
                  }
                }
              }
            }
            self2._autoResume();
            var source = self2.ctx.createBufferSource();
            source.buffer = self2._scratchBuffer;
            source.connect(self2.ctx.destination);
            if (typeof source.start === "undefined") {
              source.noteOn(0);
            } else {
              source.start(0);
            }
            if (typeof self2.ctx.resume === "function") {
              self2.ctx.resume();
            }
            source.onended = function() {
              source.disconnect(0);
              self2._audioUnlocked = true;
              document.removeEventListener("touchstart", unlock, true);
              document.removeEventListener("touchend", unlock, true);
              document.removeEventListener("click", unlock, true);
              document.removeEventListener("keydown", unlock, true);
              for (var i2 = 0; i2 < self2._howls.length; i2++) {
                self2._howls[i2]._emit("unlock");
              }
            };
          };
          document.addEventListener("touchstart", unlock, true);
          document.addEventListener("touchend", unlock, true);
          document.addEventListener("click", unlock, true);
          document.addEventListener("keydown", unlock, true);
          return self2;
        },
        /**
         * Get an unlocked HTML5 Audio object from the pool. If none are left,
         * return a new Audio object and throw a warning.
         * @return {Audio} HTML5 Audio object.
         */
        _obtainHtml5Audio: function() {
          var self2 = this || Howler2;
          if (self2._html5AudioPool.length) {
            return self2._html5AudioPool.pop();
          }
          var testPlay = new Audio().play();
          if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
            testPlay.catch(function() {
              console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
            });
          }
          return new Audio();
        },
        /**
         * Return an activated HTML5 Audio object to the pool.
         * @return {Howler}
         */
        _releaseHtml5Audio: function(audio) {
          var self2 = this || Howler2;
          if (audio._unlocked) {
            self2._html5AudioPool.push(audio);
          }
          return self2;
        },
        /**
         * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
         * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
         * @return {Howler}
         */
        _autoSuspend: function() {
          var self2 = this;
          if (!self2.autoSuspend || !self2.ctx || typeof self2.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          for (var i = 0; i < self2._howls.length; i++) {
            if (self2._howls[i]._webAudio) {
              for (var j = 0; j < self2._howls[i]._sounds.length; j++) {
                if (!self2._howls[i]._sounds[j]._paused) {
                  return self2;
                }
              }
            }
          }
          if (self2._suspendTimer) {
            clearTimeout(self2._suspendTimer);
          }
          self2._suspendTimer = setTimeout(function() {
            if (!self2.autoSuspend) {
              return;
            }
            self2._suspendTimer = null;
            self2.state = "suspending";
            var handleSuspension = function() {
              self2.state = "suspended";
              if (self2._resumeAfterSuspend) {
                delete self2._resumeAfterSuspend;
                self2._autoResume();
              }
            };
            self2.ctx.suspend().then(handleSuspension, handleSuspension);
          }, 3e4);
          return self2;
        },
        /**
         * Automatically resume the Web Audio AudioContext when a new sound is played.
         * @return {Howler}
         */
        _autoResume: function() {
          var self2 = this;
          if (!self2.ctx || typeof self2.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          if (self2.state === "running" && self2.ctx.state !== "interrupted" && self2._suspendTimer) {
            clearTimeout(self2._suspendTimer);
            self2._suspendTimer = null;
          } else if (self2.state === "suspended" || self2.state === "running" && self2.ctx.state === "interrupted") {
            self2.ctx.resume().then(function() {
              self2.state = "running";
              for (var i = 0; i < self2._howls.length; i++) {
                self2._howls[i]._emit("resume");
              }
            });
            if (self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
              self2._suspendTimer = null;
            }
          } else if (self2.state === "suspending") {
            self2._resumeAfterSuspend = true;
          }
          return self2;
        }
      };
      var Howler2 = new HowlerGlobal2();
      var Howl2 = function(o) {
        var self2 = this;
        if (!o.src || o.src.length === 0) {
          console.error("An array of source files must be passed with any new Howl.");
          return;
        }
        self2.init(o);
      };
      Howl2.prototype = {
        /**
         * Initialize a new Howl group object.
         * @param  {Object} o Passed in properties for this group.
         * @return {Howl}
         */
        init: function(o) {
          var self2 = this;
          if (!Howler2.ctx) {
            setupAudioContext();
          }
          self2._autoplay = o.autoplay || false;
          self2._format = typeof o.format !== "string" ? o.format : [o.format];
          self2._html5 = o.html5 || false;
          self2._muted = o.mute || false;
          self2._loop = o.loop || false;
          self2._pool = o.pool || 5;
          self2._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
          self2._rate = o.rate || 1;
          self2._sprite = o.sprite || {};
          self2._src = typeof o.src !== "string" ? o.src : [o.src];
          self2._volume = o.volume !== void 0 ? o.volume : 1;
          self2._xhr = {
            method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
            headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
            withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
          };
          self2._duration = 0;
          self2._state = "unloaded";
          self2._sounds = [];
          self2._endTimers = {};
          self2._queue = [];
          self2._playLock = false;
          self2._onend = o.onend ? [{ fn: o.onend }] : [];
          self2._onfade = o.onfade ? [{ fn: o.onfade }] : [];
          self2._onload = o.onload ? [{ fn: o.onload }] : [];
          self2._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
          self2._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
          self2._onpause = o.onpause ? [{ fn: o.onpause }] : [];
          self2._onplay = o.onplay ? [{ fn: o.onplay }] : [];
          self2._onstop = o.onstop ? [{ fn: o.onstop }] : [];
          self2._onmute = o.onmute ? [{ fn: o.onmute }] : [];
          self2._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
          self2._onrate = o.onrate ? [{ fn: o.onrate }] : [];
          self2._onseek = o.onseek ? [{ fn: o.onseek }] : [];
          self2._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
          self2._onresume = [];
          self2._webAudio = Howler2.usingWebAudio && !self2._html5;
          if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
            Howler2._unlockAudio();
          }
          Howler2._howls.push(self2);
          if (self2._autoplay) {
            self2._queue.push({
              event: "play",
              action: function() {
                self2.play();
              }
            });
          }
          if (self2._preload && self2._preload !== "none") {
            self2.load();
          }
          return self2;
        },
        /**
         * Load the audio file.
         * @return {Howler}
         */
        load: function() {
          var self2 = this;
          var url = null;
          if (Howler2.noAudio) {
            self2._emit("loaderror", null, "No audio support.");
            return;
          }
          if (typeof self2._src === "string") {
            self2._src = [self2._src];
          }
          for (var i = 0; i < self2._src.length; i++) {
            var ext, str5;
            if (self2._format && self2._format[i]) {
              ext = self2._format[i];
            } else {
              str5 = self2._src[i];
              if (typeof str5 !== "string") {
                self2._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              ext = /^data:audio\/([^;,]+);/i.exec(str5);
              if (!ext) {
                ext = /\.([^.]+)$/.exec(str5.split("?", 1)[0]);
              }
              if (ext) {
                ext = ext[1].toLowerCase();
              }
            }
            if (!ext) {
              console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
            }
            if (ext && Howler2.codecs(ext)) {
              url = self2._src[i];
              break;
            }
          }
          if (!url) {
            self2._emit("loaderror", null, "No codec support for selected audio sources.");
            return;
          }
          self2._src = url;
          self2._state = "loading";
          if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
            self2._html5 = true;
            self2._webAudio = false;
          }
          new Sound2(self2);
          if (self2._webAudio) {
            loadBuffer(self2);
          }
          return self2;
        },
        /**
         * Play a sound or resume previous playback.
         * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Number}          Sound ID.
         */
        play: function(sprite, internal) {
          var self2 = this;
          var id = null;
          if (typeof sprite === "number") {
            id = sprite;
            sprite = null;
          } else if (typeof sprite === "string" && self2._state === "loaded" && !self2._sprite[sprite]) {
            return null;
          } else if (typeof sprite === "undefined") {
            sprite = "__default";
            if (!self2._playLock) {
              var num = 0;
              for (var i = 0; i < self2._sounds.length; i++) {
                if (self2._sounds[i]._paused && !self2._sounds[i]._ended) {
                  num++;
                  id = self2._sounds[i]._id;
                }
              }
              if (num === 1) {
                sprite = null;
              } else {
                id = null;
              }
            }
          }
          var sound = id ? self2._soundById(id) : self2._inactiveSound();
          if (!sound) {
            return null;
          }
          if (id && !sprite) {
            sprite = sound._sprite || "__default";
          }
          if (self2._state !== "loaded") {
            sound._sprite = sprite;
            sound._ended = false;
            var soundId = sound._id;
            self2._queue.push({
              event: "play",
              action: function() {
                self2.play(soundId);
              }
            });
            return soundId;
          }
          if (id && !sound._paused) {
            if (!internal) {
              self2._loadQueue("play");
            }
            return sound._id;
          }
          if (self2._webAudio) {
            Howler2._autoResume();
          }
          var seek = Math.max(0, sound._seek > 0 ? sound._seek : self2._sprite[sprite][0] / 1e3);
          var duration = Math.max(0, (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3 - seek);
          var timeout = duration * 1e3 / Math.abs(sound._rate);
          var start = self2._sprite[sprite][0] / 1e3;
          var stop = (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3;
          sound._sprite = sprite;
          sound._ended = false;
          var setParams = function() {
            sound._paused = false;
            sound._seek = seek;
            sound._start = start;
            sound._stop = stop;
            sound._loop = !!(sound._loop || self2._sprite[sprite][2]);
          };
          if (seek >= stop) {
            self2._ended(sound);
            return;
          }
          var node = sound._node;
          if (self2._webAudio) {
            var playWebAudio = function() {
              self2._playLock = false;
              setParams();
              self2._refreshBuffer(sound);
              var vol = sound._muted || self2._muted ? 0 : sound._volume;
              node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              sound._playStart = Howler2.ctx.currentTime;
              if (typeof node.bufferSource.start === "undefined") {
                sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
              } else {
                sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
              }
              if (timeout !== Infinity) {
                self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
              }
              if (!internal) {
                setTimeout(function() {
                  self2._emit("play", sound._id);
                  self2._loadQueue();
                }, 0);
              }
            };
            if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
              playWebAudio();
            } else {
              self2._playLock = true;
              self2.once("resume", playWebAudio);
              self2._clearTimer(sound._id);
            }
          } else {
            var playHtml5 = function() {
              node.currentTime = seek;
              node.muted = sound._muted || self2._muted || Howler2._muted || node.muted;
              node.volume = sound._volume * Howler2.volume();
              node.playbackRate = sound._rate;
              try {
                var play = node.play();
                if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                  self2._playLock = true;
                  setParams();
                  play.then(function() {
                    self2._playLock = false;
                    node._unlocked = true;
                    if (!internal) {
                      self2._emit("play", sound._id);
                    } else {
                      self2._loadQueue();
                    }
                  }).catch(function() {
                    self2._playLock = false;
                    self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    sound._ended = true;
                    sound._paused = true;
                  });
                } else if (!internal) {
                  self2._playLock = false;
                  setParams();
                  self2._emit("play", sound._id);
                }
                node.playbackRate = sound._rate;
                if (node.paused) {
                  self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                if (sprite !== "__default" || sound._loop) {
                  self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                } else {
                  self2._endTimers[sound._id] = function() {
                    self2._ended(sound);
                    node.removeEventListener("ended", self2._endTimers[sound._id], false);
                  };
                  node.addEventListener("ended", self2._endTimers[sound._id], false);
                }
              } catch (err) {
                self2._emit("playerror", sound._id, err);
              }
            };
            if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
              node.src = self2._src;
              node.load();
            }
            var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
            if (node.readyState >= 3 || loadedNoReadyState) {
              playHtml5();
            } else {
              self2._playLock = true;
              self2._state = "loading";
              var listener = function() {
                self2._state = "loaded";
                playHtml5();
                node.removeEventListener(Howler2._canPlayEvent, listener, false);
              };
              node.addEventListener(Howler2._canPlayEvent, listener, false);
              self2._clearTimer(sound._id);
            }
          }
          return sound._id;
        },
        /**
         * Pause playback and save current position.
         * @param  {Number} id The sound ID (empty to pause all in group).
         * @return {Howl}
         */
        pause: function(id) {
          var self2 = this;
          if (self2._state !== "loaded" || self2._playLock) {
            self2._queue.push({
              event: "pause",
              action: function() {
                self2.pause(id);
              }
            });
            return self2;
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self2._clearTimer(ids[i]);
            var sound = self2._soundById(ids[i]);
            if (sound && !sound._paused) {
              sound._seek = self2.seek(ids[i]);
              sound._rateSeek = 0;
              sound._paused = true;
              self2._stopFade(ids[i]);
              if (sound._node) {
                if (self2._webAudio) {
                  if (!sound._node.bufferSource) {
                    continue;
                  }
                  if (typeof sound._node.bufferSource.stop === "undefined") {
                    sound._node.bufferSource.noteOff(0);
                  } else {
                    sound._node.bufferSource.stop(0);
                  }
                  self2._cleanBuffer(sound._node);
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.pause();
                }
              }
            }
            if (!arguments[1]) {
              self2._emit("pause", sound ? sound._id : null);
            }
          }
          return self2;
        },
        /**
         * Stop playback and reset to start.
         * @param  {Number} id The sound ID (empty to stop all in group).
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Howl}
         */
        stop: function(id, internal) {
          var self2 = this;
          if (self2._state !== "loaded" || self2._playLock) {
            self2._queue.push({
              event: "stop",
              action: function() {
                self2.stop(id);
              }
            });
            return self2;
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self2._clearTimer(ids[i]);
            var sound = self2._soundById(ids[i]);
            if (sound) {
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._paused = true;
              sound._ended = true;
              self2._stopFade(ids[i]);
              if (sound._node) {
                if (self2._webAudio) {
                  if (sound._node.bufferSource) {
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self2._cleanBuffer(sound._node);
                  }
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.currentTime = sound._start || 0;
                  sound._node.pause();
                  if (sound._node.duration === Infinity) {
                    self2._clearSound(sound._node);
                  }
                }
              }
              if (!internal) {
                self2._emit("stop", sound._id);
              }
            }
          }
          return self2;
        },
        /**
         * Mute/unmute a single sound or all sounds in this Howl group.
         * @param  {Boolean} muted Set to true to mute and false to unmute.
         * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
         * @return {Howl}
         */
        mute: function(muted, id) {
          var self2 = this;
          if (self2._state !== "loaded" || self2._playLock) {
            self2._queue.push({
              event: "mute",
              action: function() {
                self2.mute(muted, id);
              }
            });
            return self2;
          }
          if (typeof id === "undefined") {
            if (typeof muted === "boolean") {
              self2._muted = muted;
            } else {
              return self2._muted;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              sound._muted = muted;
              if (sound._interval) {
                self2._stopFade(sound._id);
              }
              if (self2._webAudio && sound._node) {
                sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
              } else if (sound._node) {
                sound._node.muted = Howler2._muted ? true : muted;
              }
              self2._emit("mute", sound._id);
            }
          }
          return self2;
        },
        /**
         * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
         *   volume() -> Returns the group's volume value.
         *   volume(id) -> Returns the sound id's current volume.
         *   volume(vol) -> Sets the volume of all sounds in this Howl group.
         *   volume(vol, id) -> Sets the volume of passed sound id.
         * @return {Howl/Number} Returns self or current volume.
         */
        volume: function() {
          var self2 = this;
          var args = arguments;
          var vol, id;
          if (args.length === 0) {
            return self2._volume;
          } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
            var ids = self2._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              vol = parseFloat(args[0]);
            }
          } else if (args.length >= 2) {
            vol = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "volume",
                action: function() {
                  self2.volume.apply(self2, args);
                }
              });
              return self2;
            }
            if (typeof id === "undefined") {
              self2._volume = vol;
            }
            id = self2._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self2._soundById(id[i]);
              if (sound) {
                sound._volume = vol;
                if (!args[2]) {
                  self2._stopFade(id[i]);
                }
                if (self2._webAudio && sound._node && !sound._muted) {
                  sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                } else if (sound._node && !sound._muted) {
                  sound._node.volume = vol * Howler2.volume();
                }
                self2._emit("volume", sound._id);
              }
            }
          } else {
            sound = id ? self2._soundById(id) : self2._sounds[0];
            return sound ? sound._volume : 0;
          }
          return self2;
        },
        /**
         * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id (omit to fade all sounds).
         * @return {Howl}
         */
        fade: function(from, to, len4, id) {
          var self2 = this;
          if (self2._state !== "loaded" || self2._playLock) {
            self2._queue.push({
              event: "fade",
              action: function() {
                self2.fade(from, to, len4, id);
              }
            });
            return self2;
          }
          from = Math.min(Math.max(0, parseFloat(from)), 1);
          to = Math.min(Math.max(0, parseFloat(to)), 1);
          len4 = parseFloat(len4);
          self2.volume(from, id);
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (!id) {
                self2._stopFade(ids[i]);
              }
              if (self2._webAudio && !sound._muted) {
                var currentTime = Howler2.ctx.currentTime;
                var end = currentTime + len4 / 1e3;
                sound._volume = from;
                sound._node.gain.setValueAtTime(from, currentTime);
                sound._node.gain.linearRampToValueAtTime(to, end);
              }
              self2._startFadeInterval(sound, from, to, len4, ids[i], typeof id === "undefined");
            }
          }
          return self2;
        },
        /**
         * Starts the internal interval to fade a sound.
         * @param  {Object} sound Reference to sound to fade.
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id to fade.
         * @param  {Boolean} isGroup   If true, set the volume on the group.
         */
        _startFadeInterval: function(sound, from, to, len4, id, isGroup) {
          var self2 = this;
          var vol = from;
          var diff = to - from;
          var steps = Math.abs(diff / 0.01);
          var stepLen = Math.max(4, steps > 0 ? len4 / steps : len4);
          var lastTick = Date.now();
          sound._fadeTo = to;
          sound._interval = setInterval(function() {
            var tick = (Date.now() - lastTick) / len4;
            lastTick = Date.now();
            vol += diff * tick;
            vol = Math.round(vol * 100) / 100;
            if (diff < 0) {
              vol = Math.max(to, vol);
            } else {
              vol = Math.min(to, vol);
            }
            if (self2._webAudio) {
              sound._volume = vol;
            } else {
              self2.volume(vol, sound._id, true);
            }
            if (isGroup) {
              self2._volume = vol;
            }
            if (to < from && vol <= to || to > from && vol >= to) {
              clearInterval(sound._interval);
              sound._interval = null;
              sound._fadeTo = null;
              self2.volume(to, sound._id);
              self2._emit("fade", sound._id);
            }
          }, stepLen);
        },
        /**
         * Internal method that stops the currently playing fade when
         * a new fade starts, volume is changed or the sound is stopped.
         * @param  {Number} id The sound id.
         * @return {Howl}
         */
        _stopFade: function(id) {
          var self2 = this;
          var sound = self2._soundById(id);
          if (sound && sound._interval) {
            if (self2._webAudio) {
              sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
            }
            clearInterval(sound._interval);
            sound._interval = null;
            self2.volume(sound._fadeTo, id);
            sound._fadeTo = null;
            self2._emit("fade", id);
          }
          return self2;
        },
        /**
         * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
         *   loop() -> Returns the group's loop value.
         *   loop(id) -> Returns the sound id's loop value.
         *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
         *   loop(loop, id) -> Sets the loop value of passed sound id.
         * @return {Howl/Boolean} Returns self or current loop value.
         */
        loop: function() {
          var self2 = this;
          var args = arguments;
          var loop, id, sound;
          if (args.length === 0) {
            return self2._loop;
          } else if (args.length === 1) {
            if (typeof args[0] === "boolean") {
              loop = args[0];
              self2._loop = loop;
            } else {
              sound = self2._soundById(parseInt(args[0], 10));
              return sound ? sound._loop : false;
            }
          } else if (args.length === 2) {
            loop = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self2._soundById(ids[i]);
            if (sound) {
              sound._loop = loop;
              if (self2._webAudio && sound._node && sound._node.bufferSource) {
                sound._node.bufferSource.loop = loop;
                if (loop) {
                  sound._node.bufferSource.loopStart = sound._start || 0;
                  sound._node.bufferSource.loopEnd = sound._stop;
                  if (self2.playing(ids[i])) {
                    self2.pause(ids[i], true);
                    self2.play(ids[i], true);
                  }
                }
              }
            }
          }
          return self2;
        },
        /**
         * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   rate() -> Returns the first sound node's current playback rate.
         *   rate(id) -> Returns the sound id's current playback rate.
         *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
         *   rate(rate, id) -> Sets the playback rate of passed sound id.
         * @return {Howl/Number} Returns self or the current playback rate.
         */
        rate: function() {
          var self2 = this;
          var args = arguments;
          var rate, id;
          if (args.length === 0) {
            id = self2._sounds[0]._id;
          } else if (args.length === 1) {
            var ids = self2._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              rate = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            rate = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof rate === "number") {
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "rate",
                action: function() {
                  self2.rate.apply(self2, args);
                }
              });
              return self2;
            }
            if (typeof id === "undefined") {
              self2._rate = rate;
            }
            id = self2._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self2._soundById(id[i]);
              if (sound) {
                if (self2.playing(id[i])) {
                  sound._rateSeek = self2.seek(id[i]);
                  sound._playStart = self2._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                }
                sound._rate = rate;
                if (self2._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.playbackRate = rate;
                }
                var seek = self2.seek(id[i]);
                var duration = (self2._sprite[sound._sprite][0] + self2._sprite[sound._sprite][1]) / 1e3 - seek;
                var timeout = duration * 1e3 / Math.abs(sound._rate);
                if (self2._endTimers[id[i]] || !sound._paused) {
                  self2._clearTimer(id[i]);
                  self2._endTimers[id[i]] = setTimeout(self2._ended.bind(self2, sound), timeout);
                }
                self2._emit("rate", sound._id);
              }
            }
          } else {
            sound = self2._soundById(id);
            return sound ? sound._rate : self2._rate;
          }
          return self2;
        },
        /**
         * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   seek() -> Returns the first sound node's current seek position.
         *   seek(id) -> Returns the sound id's current seek position.
         *   seek(seek) -> Sets the seek position of the first sound node.
         *   seek(seek, id) -> Sets the seek position of passed sound id.
         * @return {Howl/Number} Returns self or the current seek position.
         */
        seek: function() {
          var self2 = this;
          var args = arguments;
          var seek, id;
          if (args.length === 0) {
            if (self2._sounds.length) {
              id = self2._sounds[0]._id;
            }
          } else if (args.length === 1) {
            var ids = self2._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else if (self2._sounds.length) {
              id = self2._sounds[0]._id;
              seek = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            seek = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          if (typeof id === "undefined") {
            return 0;
          }
          if (typeof seek === "number" && (self2._state !== "loaded" || self2._playLock)) {
            self2._queue.push({
              event: "seek",
              action: function() {
                self2.seek.apply(self2, args);
              }
            });
            return self2;
          }
          var sound = self2._soundById(id);
          if (sound) {
            if (typeof seek === "number" && seek >= 0) {
              var playing = self2.playing(id);
              if (playing) {
                self2.pause(id, true);
              }
              sound._seek = seek;
              sound._ended = false;
              self2._clearTimer(id);
              if (!self2._webAudio && sound._node && !isNaN(sound._node.duration)) {
                sound._node.currentTime = seek;
              }
              var seekAndEmit = function() {
                if (playing) {
                  self2.play(id, true);
                }
                self2._emit("seek", id);
              };
              if (playing && !self2._webAudio) {
                var emitSeek = function() {
                  if (!self2._playLock) {
                    seekAndEmit();
                  } else {
                    setTimeout(emitSeek, 0);
                  }
                };
                setTimeout(emitSeek, 0);
              } else {
                seekAndEmit();
              }
            } else {
              if (self2._webAudio) {
                var realTime = self2.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
              } else {
                return sound._node.currentTime;
              }
            }
          }
          return self2;
        },
        /**
         * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
         * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
         * @return {Boolean} True if playing and false if not.
         */
        playing: function(id) {
          var self2 = this;
          if (typeof id === "number") {
            var sound = self2._soundById(id);
            return sound ? !sound._paused : false;
          }
          for (var i = 0; i < self2._sounds.length; i++) {
            if (!self2._sounds[i]._paused) {
              return true;
            }
          }
          return false;
        },
        /**
         * Get the duration of this sound. Passing a sound id will return the sprite duration.
         * @param  {Number} id The sound id to check. If none is passed, return full source duration.
         * @return {Number} Audio duration in seconds.
         */
        duration: function(id) {
          var self2 = this;
          var duration = self2._duration;
          var sound = self2._soundById(id);
          if (sound) {
            duration = self2._sprite[sound._sprite][1] / 1e3;
          }
          return duration;
        },
        /**
         * Returns the current loaded state of this Howl.
         * @return {String} 'unloaded', 'loading', 'loaded'
         */
        state: function() {
          return this._state;
        },
        /**
         * Unload and destroy the current Howl object.
         * This will immediately stop all sound instances attached to this group.
         */
        unload: function() {
          var self2 = this;
          var sounds = self2._sounds;
          for (var i = 0; i < sounds.length; i++) {
            if (!sounds[i]._paused) {
              self2.stop(sounds[i]._id);
            }
            if (!self2._webAudio) {
              self2._clearSound(sounds[i]._node);
              sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
              sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
              sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
              Howler2._releaseHtml5Audio(sounds[i]._node);
            }
            delete sounds[i]._node;
            self2._clearTimer(sounds[i]._id);
          }
          var index = Howler2._howls.indexOf(self2);
          if (index >= 0) {
            Howler2._howls.splice(index, 1);
          }
          var remCache = true;
          for (i = 0; i < Howler2._howls.length; i++) {
            if (Howler2._howls[i]._src === self2._src || self2._src.indexOf(Howler2._howls[i]._src) >= 0) {
              remCache = false;
              break;
            }
          }
          if (cache && remCache) {
            delete cache[self2._src];
          }
          Howler2.noAudio = false;
          self2._state = "unloaded";
          self2._sounds = [];
          self2 = null;
          return null;
        },
        /**
         * Listen to a custom event.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
         * @return {Howl}
         */
        on: function(event, fn, id, once) {
          var self2 = this;
          var events = self2["_on" + event];
          if (typeof fn === "function") {
            events.push(once ? { id, fn, once } : { id, fn });
          }
          return self2;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(event, fn, id) {
          var self2 = this;
          var events = self2["_on" + event];
          var i = 0;
          if (typeof fn === "number") {
            id = fn;
            fn = null;
          }
          if (fn || id) {
            for (i = 0; i < events.length; i++) {
              var isId = id === events[i].id;
              if (fn === events[i].fn && isId || !fn && isId) {
                events.splice(i, 1);
                break;
              }
            }
          } else if (event) {
            self2["_on" + event] = [];
          } else {
            var keys = Object.keys(self2);
            for (i = 0; i < keys.length; i++) {
              if (keys[i].indexOf("_on") === 0 && Array.isArray(self2[keys[i]])) {
                self2[keys[i]] = [];
              }
            }
          }
          return self2;
        },
        /**
         * Listen to a custom event and remove it once fired.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @return {Howl}
         */
        once: function(event, fn, id) {
          var self2 = this;
          self2.on(event, fn, id, 1);
          return self2;
        },
        /**
         * Emit all events of a specific type and pass the sound id.
         * @param  {String} event Event name.
         * @param  {Number} id    Sound ID.
         * @param  {Number} msg   Message to go with event.
         * @return {Howl}
         */
        _emit: function(event, id, msg) {
          var self2 = this;
          var events = self2["_on" + event];
          for (var i = events.length - 1; i >= 0; i--) {
            if (!events[i].id || events[i].id === id || event === "load") {
              setTimeout(function(fn) {
                fn.call(this, id, msg);
              }.bind(self2, events[i].fn), 0);
              if (events[i].once) {
                self2.off(event, events[i].fn, events[i].id);
              }
            }
          }
          self2._loadQueue(event);
          return self2;
        },
        /**
         * Queue of actions initiated before the sound has loaded.
         * These will be called in sequence, with the next only firing
         * after the previous has finished executing (even if async like play).
         * @return {Howl}
         */
        _loadQueue: function(event) {
          var self2 = this;
          if (self2._queue.length > 0) {
            var task = self2._queue[0];
            if (task.event === event) {
              self2._queue.shift();
              self2._loadQueue();
            }
            if (!event) {
              task.action();
            }
          }
          return self2;
        },
        /**
         * Fired when playback ends at the end of the duration.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _ended: function(sound) {
          var self2 = this;
          var sprite = sound._sprite;
          if (!self2._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
            setTimeout(self2._ended.bind(self2, sound), 100);
            return self2;
          }
          var loop = !!(sound._loop || self2._sprite[sprite][2]);
          self2._emit("end", sound._id);
          if (!self2._webAudio && loop) {
            self2.stop(sound._id, true).play(sound._id);
          }
          if (self2._webAudio && loop) {
            self2._emit("play", sound._id);
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            sound._playStart = Howler2.ctx.currentTime;
            var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
            self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
          }
          if (self2._webAudio && !loop) {
            sound._paused = true;
            sound._ended = true;
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            self2._clearTimer(sound._id);
            self2._cleanBuffer(sound._node);
            Howler2._autoSuspend();
          }
          if (!self2._webAudio && !loop) {
            self2.stop(sound._id, true);
          }
          return self2;
        },
        /**
         * Clear the end timer for a sound playback.
         * @param  {Number} id The sound ID.
         * @return {Howl}
         */
        _clearTimer: function(id) {
          var self2 = this;
          if (self2._endTimers[id]) {
            if (typeof self2._endTimers[id] !== "function") {
              clearTimeout(self2._endTimers[id]);
            } else {
              var sound = self2._soundById(id);
              if (sound && sound._node) {
                sound._node.removeEventListener("ended", self2._endTimers[id], false);
              }
            }
            delete self2._endTimers[id];
          }
          return self2;
        },
        /**
         * Return the sound identified by this ID, or return null.
         * @param  {Number} id Sound ID
         * @return {Object}    Sound object or null.
         */
        _soundById: function(id) {
          var self2 = this;
          for (var i = 0; i < self2._sounds.length; i++) {
            if (id === self2._sounds[i]._id) {
              return self2._sounds[i];
            }
          }
          return null;
        },
        /**
         * Return an inactive sound from the pool or create a new one.
         * @return {Sound} Sound playback object.
         */
        _inactiveSound: function() {
          var self2 = this;
          self2._drain();
          for (var i = 0; i < self2._sounds.length; i++) {
            if (self2._sounds[i]._ended) {
              return self2._sounds[i].reset();
            }
          }
          return new Sound2(self2);
        },
        /**
         * Drain excess inactive sounds from the pool.
         */
        _drain: function() {
          var self2 = this;
          var limit = self2._pool;
          var cnt = 0;
          var i = 0;
          if (self2._sounds.length < limit) {
            return;
          }
          for (i = 0; i < self2._sounds.length; i++) {
            if (self2._sounds[i]._ended) {
              cnt++;
            }
          }
          for (i = self2._sounds.length - 1; i >= 0; i--) {
            if (cnt <= limit) {
              return;
            }
            if (self2._sounds[i]._ended) {
              if (self2._webAudio && self2._sounds[i]._node) {
                self2._sounds[i]._node.disconnect(0);
              }
              self2._sounds.splice(i, 1);
              cnt--;
            }
          }
        },
        /**
         * Get all ID's from the sounds pool.
         * @param  {Number} id Only return one ID if one is passed.
         * @return {Array}    Array of IDs.
         */
        _getSoundIds: function(id) {
          var self2 = this;
          if (typeof id === "undefined") {
            var ids = [];
            for (var i = 0; i < self2._sounds.length; i++) {
              ids.push(self2._sounds[i]._id);
            }
            return ids;
          } else {
            return [id];
          }
        },
        /**
         * Load the sound back into the buffer source.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _refreshBuffer: function(sound) {
          var self2 = this;
          sound._node.bufferSource = Howler2.ctx.createBufferSource();
          sound._node.bufferSource.buffer = cache[self2._src];
          if (sound._panner) {
            sound._node.bufferSource.connect(sound._panner);
          } else {
            sound._node.bufferSource.connect(sound._node);
          }
          sound._node.bufferSource.loop = sound._loop;
          if (sound._loop) {
            sound._node.bufferSource.loopStart = sound._start || 0;
            sound._node.bufferSource.loopEnd = sound._stop || 0;
          }
          sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
          return self2;
        },
        /**
         * Prevent memory leaks by cleaning up the buffer source after playback.
         * @param  {Object} node Sound's audio node containing the buffer source.
         * @return {Howl}
         */
        _cleanBuffer: function(node) {
          var self2 = this;
          var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
          if (!node.bufferSource) {
            return self2;
          }
          if (Howler2._scratchBuffer && node.bufferSource) {
            node.bufferSource.onended = null;
            node.bufferSource.disconnect(0);
            if (isIOS) {
              try {
                node.bufferSource.buffer = Howler2._scratchBuffer;
              } catch (e) {
              }
            }
          }
          node.bufferSource = null;
          return self2;
        },
        /**
         * Set the source to a 0-second silence to stop any downloading (except in IE).
         * @param  {Object} node Audio node to clear.
         */
        _clearSound: function(node) {
          var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
          if (!checkIE) {
            node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
          }
        }
      };
      var Sound2 = function(howl) {
        this._parent = howl;
        this.init();
      };
      Sound2.prototype = {
        /**
         * Initialize a new Sound object.
         * @return {Sound}
         */
        init: function() {
          var self2 = this;
          var parent = self2._parent;
          self2._muted = parent._muted;
          self2._loop = parent._loop;
          self2._volume = parent._volume;
          self2._rate = parent._rate;
          self2._seek = 0;
          self2._paused = true;
          self2._ended = true;
          self2._sprite = "__default";
          self2._id = ++Howler2._counter;
          parent._sounds.push(self2);
          self2.create();
          return self2;
        },
        /**
         * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
         * @return {Sound}
         */
        create: function() {
          var self2 = this;
          var parent = self2._parent;
          var volume = Howler2._muted || self2._muted || self2._parent._muted ? 0 : self2._volume;
          if (parent._webAudio) {
            self2._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            self2._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
            self2._node.paused = true;
            self2._node.connect(Howler2.masterGain);
          } else if (!Howler2.noAudio) {
            self2._node = Howler2._obtainHtml5Audio();
            self2._errorFn = self2._errorListener.bind(self2);
            self2._node.addEventListener("error", self2._errorFn, false);
            self2._loadFn = self2._loadListener.bind(self2);
            self2._node.addEventListener(Howler2._canPlayEvent, self2._loadFn, false);
            self2._endFn = self2._endListener.bind(self2);
            self2._node.addEventListener("ended", self2._endFn, false);
            self2._node.src = parent._src;
            self2._node.preload = parent._preload === true ? "auto" : parent._preload;
            self2._node.volume = volume * Howler2.volume();
            self2._node.load();
          }
          return self2;
        },
        /**
         * Reset the parameters of this sound to the original state (for recycle).
         * @return {Sound}
         */
        reset: function() {
          var self2 = this;
          var parent = self2._parent;
          self2._muted = parent._muted;
          self2._loop = parent._loop;
          self2._volume = parent._volume;
          self2._rate = parent._rate;
          self2._seek = 0;
          self2._rateSeek = 0;
          self2._paused = true;
          self2._ended = true;
          self2._sprite = "__default";
          self2._id = ++Howler2._counter;
          return self2;
        },
        /**
         * HTML5 Audio error listener callback.
         */
        _errorListener: function() {
          var self2 = this;
          self2._parent._emit("loaderror", self2._id, self2._node.error ? self2._node.error.code : 0);
          self2._node.removeEventListener("error", self2._errorFn, false);
        },
        /**
         * HTML5 Audio canplaythrough listener callback.
         */
        _loadListener: function() {
          var self2 = this;
          var parent = self2._parent;
          parent._duration = Math.ceil(self2._node.duration * 10) / 10;
          if (Object.keys(parent._sprite).length === 0) {
            parent._sprite = { __default: [0, parent._duration * 1e3] };
          }
          if (parent._state !== "loaded") {
            parent._state = "loaded";
            parent._emit("load");
            parent._loadQueue();
          }
          self2._node.removeEventListener(Howler2._canPlayEvent, self2._loadFn, false);
        },
        /**
         * HTML5 Audio ended listener callback.
         */
        _endListener: function() {
          var self2 = this;
          var parent = self2._parent;
          if (parent._duration === Infinity) {
            parent._duration = Math.ceil(self2._node.duration * 10) / 10;
            if (parent._sprite.__default[1] === Infinity) {
              parent._sprite.__default[1] = parent._duration * 1e3;
            }
            parent._ended(self2);
          }
          self2._node.removeEventListener("ended", self2._endFn, false);
        }
      };
      var cache = {};
      var loadBuffer = function(self2) {
        var url = self2._src;
        if (cache[url]) {
          self2._duration = cache[url].duration;
          loadSound(self2);
          return;
        }
        if (/^data:[^;]+;base64,/.test(url)) {
          var data = atob(url.split(",")[1]);
          var dataView = new Uint8Array(data.length);
          for (var i = 0; i < data.length; ++i) {
            dataView[i] = data.charCodeAt(i);
          }
          decodeAudioData(dataView.buffer, self2);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open(self2._xhr.method, url, true);
          xhr.withCredentials = self2._xhr.withCredentials;
          xhr.responseType = "arraybuffer";
          if (self2._xhr.headers) {
            Object.keys(self2._xhr.headers).forEach(function(key) {
              xhr.setRequestHeader(key, self2._xhr.headers[key]);
            });
          }
          xhr.onload = function() {
            var code = (xhr.status + "")[0];
            if (code !== "0" && code !== "2" && code !== "3") {
              self2._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
              return;
            }
            decodeAudioData(xhr.response, self2);
          };
          xhr.onerror = function() {
            if (self2._webAudio) {
              self2._html5 = true;
              self2._webAudio = false;
              self2._sounds = [];
              delete cache[url];
              self2.load();
            }
          };
          safeXhrSend(xhr);
        }
      };
      var safeXhrSend = function(xhr) {
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      };
      var decodeAudioData = function(arraybuffer, self2) {
        var error = function() {
          self2._emit("loaderror", null, "Decoding audio data failed.");
        };
        var success = function(buffer) {
          if (buffer && self2._sounds.length > 0) {
            cache[self2._src] = buffer;
            loadSound(self2, buffer);
          } else {
            error();
          }
        };
        if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
          Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
        } else {
          Howler2.ctx.decodeAudioData(arraybuffer, success, error);
        }
      };
      var loadSound = function(self2, buffer) {
        if (buffer && !self2._duration) {
          self2._duration = buffer.duration;
        }
        if (Object.keys(self2._sprite).length === 0) {
          self2._sprite = { __default: [0, self2._duration * 1e3] };
        }
        if (self2._state !== "loaded") {
          self2._state = "loaded";
          self2._emit("load");
          self2._loadQueue();
        }
      };
      var setupAudioContext = function() {
        if (!Howler2.usingWebAudio) {
          return;
        }
        try {
          if (typeof AudioContext !== "undefined") {
            Howler2.ctx = new AudioContext();
          } else if (typeof webkitAudioContext !== "undefined") {
            Howler2.ctx = new webkitAudioContext();
          } else {
            Howler2.usingWebAudio = false;
          }
        } catch (e) {
          Howler2.usingWebAudio = false;
        }
        if (!Howler2.ctx) {
          Howler2.usingWebAudio = false;
        }
        var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
        var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        var version = appVersion ? parseInt(appVersion[1], 10) : null;
        if (iOS && version && version < 9) {
          var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
          if (Howler2._navigator && !safari) {
            Howler2.usingWebAudio = false;
          }
        }
        if (Howler2.usingWebAudio) {
          Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
          Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
          Howler2.masterGain.connect(Howler2.ctx.destination);
        }
        Howler2._setup();
      };
      if (typeof define === "function" && define.amd) {
        define([], function() {
          return {
            Howler: Howler2,
            Howl: Howl2
          };
        });
      }
      if (typeof exports !== "undefined") {
        exports.Howler = Howler2;
        exports.Howl = Howl2;
      }
      if (typeof global !== "undefined") {
        global.HowlerGlobal = HowlerGlobal2;
        global.Howler = Howler2;
        global.Howl = Howl2;
        global.Sound = Sound2;
      } else if (typeof window !== "undefined") {
        window.HowlerGlobal = HowlerGlobal2;
        window.Howler = Howler2;
        window.Howl = Howl2;
        window.Sound = Sound2;
      }
    })();
    (function() {
      "use strict";
      HowlerGlobal.prototype._pos = [0, 0, 0];
      HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
      HowlerGlobal.prototype.stereo = function(pan) {
        var self2 = this;
        if (!self2.ctx || !self2.ctx.listener) {
          return self2;
        }
        for (var i = self2._howls.length - 1; i >= 0; i--) {
          self2._howls[i].stereo(pan);
        }
        return self2;
      };
      HowlerGlobal.prototype.pos = function(x, y, z) {
        var self2 = this;
        if (!self2.ctx || !self2.ctx.listener) {
          return self2;
        }
        y = typeof y !== "number" ? self2._pos[1] : y;
        z = typeof z !== "number" ? self2._pos[2] : z;
        if (typeof x === "number") {
          self2._pos = [x, y, z];
          if (typeof self2.ctx.listener.positionX !== "undefined") {
            self2.ctx.listener.positionX.setTargetAtTime(self2._pos[0], Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.positionY.setTargetAtTime(self2._pos[1], Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.positionZ.setTargetAtTime(self2._pos[2], Howler.ctx.currentTime, 0.1);
          } else {
            self2.ctx.listener.setPosition(self2._pos[0], self2._pos[1], self2._pos[2]);
          }
        } else {
          return self2._pos;
        }
        return self2;
      };
      HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
        var self2 = this;
        if (!self2.ctx || !self2.ctx.listener) {
          return self2;
        }
        var or = self2._orientation;
        y = typeof y !== "number" ? or[1] : y;
        z = typeof z !== "number" ? or[2] : z;
        xUp = typeof xUp !== "number" ? or[3] : xUp;
        yUp = typeof yUp !== "number" ? or[4] : yUp;
        zUp = typeof zUp !== "number" ? or[5] : zUp;
        if (typeof x === "number") {
          self2._orientation = [x, y, z, xUp, yUp, zUp];
          if (typeof self2.ctx.listener.forwardX !== "undefined") {
            self2.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
            self2.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
          } else {
            self2.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
          }
        } else {
          return or;
        }
        return self2;
      };
      Howl.prototype.init = function(_super) {
        return function(o) {
          var self2 = this;
          self2._orientation = o.orientation || [1, 0, 0];
          self2._stereo = o.stereo || null;
          self2._pos = o.pos || null;
          self2._pannerAttr = {
            coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
            coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
            coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
            distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
            maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
            panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
            refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
            rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
          };
          self2._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
          self2._onpos = o.onpos ? [{ fn: o.onpos }] : [];
          self2._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
          return _super.call(this, o);
        };
      }(Howl.prototype.init);
      Howl.prototype.stereo = function(pan, id) {
        var self2 = this;
        if (!self2._webAudio) {
          return self2;
        }
        if (self2._state !== "loaded") {
          self2._queue.push({
            event: "stereo",
            action: function() {
              self2.stereo(pan, id);
            }
          });
          return self2;
        }
        var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
        if (typeof id === "undefined") {
          if (typeof pan === "number") {
            self2._stereo = pan;
            self2._pos = [pan, 0, 0];
          } else {
            return self2._stereo;
          }
        }
        var ids = self2._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self2._soundById(ids[i]);
          if (sound) {
            if (typeof pan === "number") {
              sound._stereo = pan;
              sound._pos = [pan, 0, 0];
              if (sound._node) {
                sound._pannerAttr.panningModel = "equalpower";
                if (!sound._panner || !sound._panner.pan) {
                  setupPanner(sound, pannerType);
                }
                if (pannerType === "spatial") {
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(pan, 0, 0);
                  }
                } else {
                  sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                }
              }
              self2._emit("stereo", sound._id);
            } else {
              return sound._stereo;
            }
          }
        }
        return self2;
      };
      Howl.prototype.pos = function(x, y, z, id) {
        var self2 = this;
        if (!self2._webAudio) {
          return self2;
        }
        if (self2._state !== "loaded") {
          self2._queue.push({
            event: "pos",
            action: function() {
              self2.pos(x, y, z, id);
            }
          });
          return self2;
        }
        y = typeof y !== "number" ? 0 : y;
        z = typeof z !== "number" ? -0.5 : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self2._pos = [x, y, z];
          } else {
            return self2._pos;
          }
        }
        var ids = self2._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self2._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._pos = [x, y, z];
              if (sound._node) {
                if (!sound._panner || sound._panner.pan) {
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.positionX !== "undefined") {
                  sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setPosition(x, y, z);
                }
              }
              self2._emit("pos", sound._id);
            } else {
              return sound._pos;
            }
          }
        }
        return self2;
      };
      Howl.prototype.orientation = function(x, y, z, id) {
        var self2 = this;
        if (!self2._webAudio) {
          return self2;
        }
        if (self2._state !== "loaded") {
          self2._queue.push({
            event: "orientation",
            action: function() {
              self2.orientation(x, y, z, id);
            }
          });
          return self2;
        }
        y = typeof y !== "number" ? self2._orientation[1] : y;
        z = typeof z !== "number" ? self2._orientation[2] : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self2._orientation = [x, y, z];
          } else {
            return self2._orientation;
          }
        }
        var ids = self2._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self2._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._orientation = [x, y, z];
              if (sound._node) {
                if (!sound._panner) {
                  if (!sound._pos) {
                    sound._pos = self2._pos || [0, 0, -0.5];
                  }
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.orientationX !== "undefined") {
                  sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setOrientation(x, y, z);
                }
              }
              self2._emit("orientation", sound._id);
            } else {
              return sound._orientation;
            }
          }
        }
        return self2;
      };
      Howl.prototype.pannerAttr = function() {
        var self2 = this;
        var args = arguments;
        var o, id, sound;
        if (!self2._webAudio) {
          return self2;
        }
        if (args.length === 0) {
          return self2._pannerAttr;
        } else if (args.length === 1) {
          if (typeof args[0] === "object") {
            o = args[0];
            if (typeof id === "undefined") {
              if (!o.pannerAttr) {
                o.pannerAttr = {
                  coneInnerAngle: o.coneInnerAngle,
                  coneOuterAngle: o.coneOuterAngle,
                  coneOuterGain: o.coneOuterGain,
                  distanceModel: o.distanceModel,
                  maxDistance: o.maxDistance,
                  refDistance: o.refDistance,
                  rolloffFactor: o.rolloffFactor,
                  panningModel: o.panningModel
                };
              }
              self2._pannerAttr = {
                coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self2._coneInnerAngle,
                coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self2._coneOuterAngle,
                coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self2._coneOuterGain,
                distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self2._distanceModel,
                maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self2._maxDistance,
                refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self2._refDistance,
                rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self2._rolloffFactor,
                panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self2._panningModel
              };
            }
          } else {
            sound = self2._soundById(parseInt(args[0], 10));
            return sound ? sound._pannerAttr : self2._pannerAttr;
          }
        } else if (args.length === 2) {
          o = args[0];
          id = parseInt(args[1], 10);
        }
        var ids = self2._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          sound = self2._soundById(ids[i]);
          if (sound) {
            var pa = sound._pannerAttr;
            pa = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
            };
            var panner = sound._panner;
            if (!panner) {
              if (!sound._pos) {
                sound._pos = self2._pos || [0, 0, -0.5];
              }
              setupPanner(sound, "spatial");
              panner = sound._panner;
            }
            panner.coneInnerAngle = pa.coneInnerAngle;
            panner.coneOuterAngle = pa.coneOuterAngle;
            panner.coneOuterGain = pa.coneOuterGain;
            panner.distanceModel = pa.distanceModel;
            panner.maxDistance = pa.maxDistance;
            panner.refDistance = pa.refDistance;
            panner.rolloffFactor = pa.rolloffFactor;
            panner.panningModel = pa.panningModel;
          }
        }
        return self2;
      };
      Sound.prototype.init = function(_super) {
        return function() {
          var self2 = this;
          var parent = self2._parent;
          self2._orientation = parent._orientation;
          self2._stereo = parent._stereo;
          self2._pos = parent._pos;
          self2._pannerAttr = parent._pannerAttr;
          _super.call(this);
          if (self2._stereo) {
            parent.stereo(self2._stereo);
          } else if (self2._pos) {
            parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
          }
        };
      }(Sound.prototype.init);
      Sound.prototype.reset = function(_super) {
        return function() {
          var self2 = this;
          var parent = self2._parent;
          self2._orientation = parent._orientation;
          self2._stereo = parent._stereo;
          self2._pos = parent._pos;
          self2._pannerAttr = parent._pannerAttr;
          if (self2._stereo) {
            parent.stereo(self2._stereo);
          } else if (self2._pos) {
            parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
          } else if (self2._panner) {
            self2._panner.disconnect(0);
            self2._panner = void 0;
            parent._refreshBuffer(self2);
          }
          return _super.call(this);
        };
      }(Sound.prototype.reset);
      var setupPanner = function(sound, type) {
        type = type || "spatial";
        if (type === "spatial") {
          sound._panner = Howler.ctx.createPanner();
          sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
          sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
          sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
          sound._panner.distanceModel = sound._pannerAttr.distanceModel;
          sound._panner.maxDistance = sound._pannerAttr.maxDistance;
          sound._panner.refDistance = sound._pannerAttr.refDistance;
          sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
          sound._panner.panningModel = sound._pannerAttr.panningModel;
          if (typeof sound._panner.positionX !== "undefined") {
            sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
            sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
            sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
          }
          if (typeof sound._panner.orientationX !== "undefined") {
            sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
            sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
            sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
          }
        } else {
          sound._panner = Howler.ctx.createStereoPanner();
          sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
        }
        sound._panner.connect(sound._node);
        if (!sound._paused) {
          sound._parent.pause(sound._id, true).play(sound._id, true);
        }
      };
    })();
  }
});

// node_modules/earcut/src/earcut.js
var require_earcut = __commonJS({
  "node_modules/earcut/src/earcut.js"(exports, module) {
    "use strict";
    module.exports = earcut2;
    module.exports.default = earcut2;
    function earcut2(data, holeIndices, dim) {
      dim = dim || 2;
      var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
      if (!outerNode || outerNode.next === outerNode.prev)
        return triangles;
      var minX, minY, maxX, maxY, x, y, invSize;
      if (hasHoles)
        outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
      if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];
        for (var i = dim; i < outerLen; i += dim) {
          x = data[i];
          y = data[i + 1];
          if (x < minX)
            minX = x;
          if (y < minY)
            minY = y;
          if (x > maxX)
            maxX = x;
          if (y > maxY)
            maxY = y;
        }
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 32767 / invSize : 0;
      }
      earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
      return triangles;
    }
    function linkedList(data, start, end, dim, clockwise) {
      var i, last;
      if (clockwise === signedArea(data, start, end, dim) > 0) {
        for (i = start; i < end; i += dim)
          last = insertNode(i, data[i], data[i + 1], last);
      } else {
        for (i = end - dim; i >= start; i -= dim)
          last = insertNode(i, data[i], data[i + 1], last);
      }
      if (last && equals6(last, last.next)) {
        removeNode(last);
        last = last.next;
      }
      return last;
    }
    function filterPoints(start, end) {
      if (!start)
        return start;
      if (!end)
        end = start;
      var p = start, again;
      do {
        again = false;
        if (!p.steiner && (equals6(p, p.next) || area(p.prev, p, p.next) === 0)) {
          removeNode(p);
          p = end = p.prev;
          if (p === p.next)
            break;
          again = true;
        } else {
          p = p.next;
        }
      } while (again || p !== end);
      return end;
    }
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear)
        return;
      if (!pass && invSize)
        indexCurve(ear, minX, minY, invSize);
      var stop = ear, prev, next;
      while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;
        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
          triangles.push(prev.i / dim | 0);
          triangles.push(ear.i / dim | 0);
          triangles.push(next.i / dim | 0);
          removeNode(ear);
          ear = next.next;
          stop = next.next;
          continue;
        }
        ear = next;
        if (ear === stop) {
          if (!pass) {
            earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
          } else if (pass === 1) {
            ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
            earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
          } else if (pass === 2) {
            splitEarcut(ear, triangles, dim, minX, minY, invSize);
          }
          break;
        }
      }
    }
    function isEar(ear) {
      var a = ear.prev, b = ear, c = ear.next;
      if (area(a, b, c) >= 0)
        return false;
      var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
      var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
      var p = c.next;
      while (p !== a) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.next;
      }
      return true;
    }
    function isEarHashed(ear, minX, minY, invSize) {
      var a = ear.prev, b = ear, c = ear.next;
      if (area(a, b, c) >= 0)
        return false;
      var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
      var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
      var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
      var p = ear.prevZ, n = ear.nextZ;
      while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.prevZ;
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
          return false;
        n = n.nextZ;
      }
      while (p && p.z >= minZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
          return false;
        p = p.prevZ;
      }
      while (n && n.z <= maxZ) {
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
          return false;
        n = n.nextZ;
      }
      return true;
    }
    function cureLocalIntersections(start, triangles, dim) {
      var p = start;
      do {
        var a = p.prev, b = p.next.next;
        if (!equals6(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
          triangles.push(a.i / dim | 0);
          triangles.push(p.i / dim | 0);
          triangles.push(b.i / dim | 0);
          removeNode(p);
          removeNode(p.next);
          p = start = b;
        }
        p = p.next;
      } while (p !== start);
      return filterPoints(p);
    }
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
      var a = start;
      do {
        var b = a.next.next;
        while (b !== a.prev) {
          if (a.i !== b.i && isValidDiagonal(a, b)) {
            var c = splitPolygon(a, b);
            a = filterPoints(a, a.next);
            c = filterPoints(c, c.next);
            earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
            earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
            return;
          }
          b = b.next;
        }
        a = a.next;
      } while (a !== start);
    }
    function eliminateHoles(data, holeIndices, outerNode, dim) {
      var queue = [], i, len4, start, end, list;
      for (i = 0, len4 = holeIndices.length; i < len4; i++) {
        start = holeIndices[i] * dim;
        end = i < len4 - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next)
          list.steiner = true;
        queue.push(getLeftmost(list));
      }
      queue.sort(compareX);
      for (i = 0; i < queue.length; i++) {
        outerNode = eliminateHole(queue[i], outerNode);
      }
      return outerNode;
    }
    function compareX(a, b) {
      return a.x - b.x;
    }
    function eliminateHole(hole, outerNode) {
      var bridge = findHoleBridge(hole, outerNode);
      if (!bridge) {
        return outerNode;
      }
      var bridgeReverse = splitPolygon(bridge, hole);
      filterPoints(bridgeReverse, bridgeReverse.next);
      return filterPoints(bridge, bridge.next);
    }
    function findHoleBridge(hole, outerNode) {
      var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
      do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
          var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
          if (x <= hx && x > qx) {
            qx = x;
            m = p.x < p.next.x ? p : p.next;
            if (x === hx)
              return m;
          }
        }
        p = p.next;
      } while (p !== outerNode);
      if (!m)
        return null;
      var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
      p = m;
      do {
        if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
          tan = Math.abs(hy - p.y) / (hx - p.x);
          if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
            m = p;
            tanMin = tan;
          }
        }
        p = p.next;
      } while (p !== stop);
      return m;
    }
    function sectorContainsSector(m, p) {
      return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
    }
    function indexCurve(start, minX, minY, invSize) {
      var p = start;
      do {
        if (p.z === 0)
          p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
      } while (p !== start);
      p.prevZ.nextZ = null;
      p.prevZ = null;
      sortLinked(p);
    }
    function sortLinked(list) {
      var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
      do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;
        while (p) {
          numMerges++;
          q = p;
          pSize = 0;
          for (i = 0; i < inSize; i++) {
            pSize++;
            q = q.nextZ;
            if (!q)
              break;
          }
          qSize = inSize;
          while (pSize > 0 || qSize > 0 && q) {
            if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
              e = p;
              p = p.nextZ;
              pSize--;
            } else {
              e = q;
              q = q.nextZ;
              qSize--;
            }
            if (tail)
              tail.nextZ = e;
            else
              list = e;
            e.prevZ = tail;
            tail = e;
          }
          p = q;
        }
        tail.nextZ = null;
        inSize *= 2;
      } while (numMerges > 1);
      return list;
    }
    function zOrder(x, y, minX, minY, invSize) {
      x = (x - minX) * invSize | 0;
      y = (y - minY) * invSize | 0;
      x = (x | x << 8) & 16711935;
      x = (x | x << 4) & 252645135;
      x = (x | x << 2) & 858993459;
      x = (x | x << 1) & 1431655765;
      y = (y | y << 8) & 16711935;
      y = (y | y << 4) & 252645135;
      y = (y | y << 2) & 858993459;
      y = (y | y << 1) & 1431655765;
      return x | y << 1;
    }
    function getLeftmost(start) {
      var p = start, leftmost = start;
      do {
        if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
          leftmost = p;
        p = p.next;
      } while (p !== start);
      return leftmost;
    }
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
    }
    function isValidDiagonal(a, b) {
      return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
      (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
      (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
      equals6(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
    }
    function area(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }
    function equals6(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
    }
    function intersects(p1, q1, p2, q2) {
      var o1 = sign(area(p1, q1, p2));
      var o2 = sign(area(p1, q1, q2));
      var o3 = sign(area(p2, q2, p1));
      var o4 = sign(area(p2, q2, q1));
      if (o1 !== o2 && o3 !== o4)
        return true;
      if (o1 === 0 && onSegment(p1, p2, q1))
        return true;
      if (o2 === 0 && onSegment(p1, q2, q1))
        return true;
      if (o3 === 0 && onSegment(p2, p1, q2))
        return true;
      if (o4 === 0 && onSegment(p2, q1, q2))
        return true;
      return false;
    }
    function onSegment(p, q, r) {
      return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }
    function sign(num) {
      return num > 0 ? 1 : num < 0 ? -1 : 0;
    }
    function intersectsPolygon(a, b) {
      var p = a;
      do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
          return true;
        p = p.next;
      } while (p !== a);
      return false;
    }
    function locallyInside(a, b) {
      return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }
    function middleInside(a, b) {
      var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
      do {
        if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
          inside = !inside;
        p = p.next;
      } while (p !== a);
      return inside;
    }
    function splitPolygon(a, b) {
      var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
      a.next = b;
      b.prev = a;
      a2.next = an;
      an.prev = a2;
      b2.next = a2;
      a2.prev = b2;
      bp.next = b2;
      b2.prev = bp;
      return b2;
    }
    function insertNode(i, x, y, last) {
      var p = new Node(i, x, y);
      if (!last) {
        p.prev = p;
        p.next = p;
      } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
      }
      return p;
    }
    function removeNode(p) {
      p.next.prev = p.prev;
      p.prev.next = p.next;
      if (p.prevZ)
        p.prevZ.nextZ = p.nextZ;
      if (p.nextZ)
        p.nextZ.prevZ = p.prevZ;
    }
    function Node(i, x, y) {
      this.i = i;
      this.x = x;
      this.y = y;
      this.prev = null;
      this.next = null;
      this.z = 0;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
    }
    earcut2.deviation = function(data, holeIndices, dim, triangles) {
      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
      var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
      if (hasHoles) {
        for (var i = 0, len4 = holeIndices.length; i < len4; i++) {
          var start = holeIndices[i] * dim;
          var end = i < len4 - 1 ? holeIndices[i + 1] * dim : data.length;
          polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
      }
      var trianglesArea = 0;
      for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
          (data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1])
        );
      }
      return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
    };
    function signedArea(data, start, end, dim) {
      var sum = 0;
      for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
      }
      return sum;
    }
    earcut2.flatten = function(data) {
      var dim = data[0][0].length, result = { vertices: [], holes: [], dimensions: dim }, holeIndex = 0;
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
          for (var d = 0; d < dim; d++)
            result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
          holeIndex += data[i - 1].length;
          result.holes.push(holeIndex);
        }
      }
      return result;
    };
  }
});

// node_modules/colyseus.js/lib/legacy.js
var require_legacy = __commonJS({
  "node_modules/colyseus.js/lib/legacy.js"() {
    if (!ArrayBuffer.isView) {
      ArrayBuffer.isView = (a) => {
        return a !== null && typeof a === "object" && a.buffer instanceof ArrayBuffer;
      };
    }
    if (typeof globalThis === "undefined" && typeof window !== "undefined") {
      window["globalThis"] = window;
    }
  }
});

// node_modules/colyseus.js/lib/errors/ServerError.js
var require_ServerError = __commonJS({
  "node_modules/colyseus.js/lib/errors/ServerError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerError = exports.CloseCode = void 0;
    var CloseCode;
    (function(CloseCode2) {
      CloseCode2[CloseCode2["CONSENTED"] = 4e3] = "CONSENTED";
      CloseCode2[CloseCode2["DEVMODE_RESTART"] = 4010] = "DEVMODE_RESTART";
    })(CloseCode = exports.CloseCode || (exports.CloseCode = {}));
    var ServerError = class extends Error {
      constructor(code, message) {
        super(message);
        this.name = "ServerError";
        this.code = code;
      }
    };
    exports.ServerError = ServerError;
  }
});

// node_modules/colyseus.js/lib/msgpack/index.js
var require_msgpack = __commonJS({
  "node_modules/colyseus.js/lib/msgpack/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decode = exports.encode = void 0;
    function Decoder(buffer, offset2) {
      this._offset = offset2;
      if (buffer instanceof ArrayBuffer) {
        this._buffer = buffer;
        this._view = new DataView(this._buffer);
      } else if (ArrayBuffer.isView(buffer)) {
        this._buffer = buffer.buffer;
        this._view = new DataView(this._buffer, buffer.byteOffset, buffer.byteLength);
      } else {
        throw new Error("Invalid argument");
      }
    }
    function utf8Read(view, offset2, length5) {
      var string = "", chr = 0;
      for (var i = offset2, end = offset2 + length5; i < end; i++) {
        var byte = view.getUint8(i);
        if ((byte & 128) === 0) {
          string += String.fromCharCode(byte);
          continue;
        }
        if ((byte & 224) === 192) {
          string += String.fromCharCode((byte & 31) << 6 | view.getUint8(++i) & 63);
          continue;
        }
        if ((byte & 240) === 224) {
          string += String.fromCharCode((byte & 15) << 12 | (view.getUint8(++i) & 63) << 6 | (view.getUint8(++i) & 63) << 0);
          continue;
        }
        if ((byte & 248) === 240) {
          chr = (byte & 7) << 18 | (view.getUint8(++i) & 63) << 12 | (view.getUint8(++i) & 63) << 6 | (view.getUint8(++i) & 63) << 0;
          if (chr >= 65536) {
            chr -= 65536;
            string += String.fromCharCode((chr >>> 10) + 55296, (chr & 1023) + 56320);
          } else {
            string += String.fromCharCode(chr);
          }
          continue;
        }
        throw new Error("Invalid byte " + byte.toString(16));
      }
      return string;
    }
    Decoder.prototype._array = function(length5) {
      var value = new Array(length5);
      for (var i = 0; i < length5; i++) {
        value[i] = this._parse();
      }
      return value;
    };
    Decoder.prototype._map = function(length5) {
      var key = "", value = {};
      for (var i = 0; i < length5; i++) {
        key = this._parse();
        value[key] = this._parse();
      }
      return value;
    };
    Decoder.prototype._str = function(length5) {
      var value = utf8Read(this._view, this._offset, length5);
      this._offset += length5;
      return value;
    };
    Decoder.prototype._bin = function(length5) {
      var value = this._buffer.slice(this._offset, this._offset + length5);
      this._offset += length5;
      return value;
    };
    Decoder.prototype._parse = function() {
      var prefix = this._view.getUint8(this._offset++);
      var value, length5 = 0, type = 0, hi = 0, lo = 0;
      if (prefix < 192) {
        if (prefix < 128) {
          return prefix;
        }
        if (prefix < 144) {
          return this._map(prefix & 15);
        }
        if (prefix < 160) {
          return this._array(prefix & 15);
        }
        return this._str(prefix & 31);
      }
      if (prefix > 223) {
        return (255 - prefix + 1) * -1;
      }
      switch (prefix) {
        case 192:
          return null;
        case 194:
          return false;
        case 195:
          return true;
        case 196:
          length5 = this._view.getUint8(this._offset);
          this._offset += 1;
          return this._bin(length5);
        case 197:
          length5 = this._view.getUint16(this._offset);
          this._offset += 2;
          return this._bin(length5);
        case 198:
          length5 = this._view.getUint32(this._offset);
          this._offset += 4;
          return this._bin(length5);
        case 199:
          length5 = this._view.getUint8(this._offset);
          type = this._view.getInt8(this._offset + 1);
          this._offset += 2;
          if (type === -1) {
            var ns = this._view.getUint32(this._offset);
            hi = this._view.getInt32(this._offset + 4);
            lo = this._view.getUint32(this._offset + 8);
            this._offset += 12;
            return new Date((hi * 4294967296 + lo) * 1e3 + ns / 1e6);
          }
          return [type, this._bin(length5)];
        case 200:
          length5 = this._view.getUint16(this._offset);
          type = this._view.getInt8(this._offset + 2);
          this._offset += 3;
          return [type, this._bin(length5)];
        case 201:
          length5 = this._view.getUint32(this._offset);
          type = this._view.getInt8(this._offset + 4);
          this._offset += 5;
          return [type, this._bin(length5)];
        case 202:
          value = this._view.getFloat32(this._offset);
          this._offset += 4;
          return value;
        case 203:
          value = this._view.getFloat64(this._offset);
          this._offset += 8;
          return value;
        case 204:
          value = this._view.getUint8(this._offset);
          this._offset += 1;
          return value;
        case 205:
          value = this._view.getUint16(this._offset);
          this._offset += 2;
          return value;
        case 206:
          value = this._view.getUint32(this._offset);
          this._offset += 4;
          return value;
        case 207:
          hi = this._view.getUint32(this._offset) * Math.pow(2, 32);
          lo = this._view.getUint32(this._offset + 4);
          this._offset += 8;
          return hi + lo;
        case 208:
          value = this._view.getInt8(this._offset);
          this._offset += 1;
          return value;
        case 209:
          value = this._view.getInt16(this._offset);
          this._offset += 2;
          return value;
        case 210:
          value = this._view.getInt32(this._offset);
          this._offset += 4;
          return value;
        case 211:
          hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
          lo = this._view.getUint32(this._offset + 4);
          this._offset += 8;
          return hi + lo;
        case 212:
          type = this._view.getInt8(this._offset);
          this._offset += 1;
          if (type === 0) {
            this._offset += 1;
            return void 0;
          }
          return [type, this._bin(1)];
        case 213:
          type = this._view.getInt8(this._offset);
          this._offset += 1;
          return [type, this._bin(2)];
        case 214:
          type = this._view.getInt8(this._offset);
          this._offset += 1;
          if (type === -1) {
            value = this._view.getUint32(this._offset);
            this._offset += 4;
            return new Date(value * 1e3);
          }
          return [type, this._bin(4)];
        case 215:
          type = this._view.getInt8(this._offset);
          this._offset += 1;
          if (type === 0) {
            hi = this._view.getInt32(this._offset) * Math.pow(2, 32);
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            return new Date(hi + lo);
          }
          if (type === -1) {
            hi = this._view.getUint32(this._offset);
            lo = this._view.getUint32(this._offset + 4);
            this._offset += 8;
            var s = (hi & 3) * 4294967296 + lo;
            return new Date(s * 1e3 + (hi >>> 2) / 1e6);
          }
          return [type, this._bin(8)];
        case 216:
          type = this._view.getInt8(this._offset);
          this._offset += 1;
          return [type, this._bin(16)];
        case 217:
          length5 = this._view.getUint8(this._offset);
          this._offset += 1;
          return this._str(length5);
        case 218:
          length5 = this._view.getUint16(this._offset);
          this._offset += 2;
          return this._str(length5);
        case 219:
          length5 = this._view.getUint32(this._offset);
          this._offset += 4;
          return this._str(length5);
        case 220:
          length5 = this._view.getUint16(this._offset);
          this._offset += 2;
          return this._array(length5);
        case 221:
          length5 = this._view.getUint32(this._offset);
          this._offset += 4;
          return this._array(length5);
        case 222:
          length5 = this._view.getUint16(this._offset);
          this._offset += 2;
          return this._map(length5);
        case 223:
          length5 = this._view.getUint32(this._offset);
          this._offset += 4;
          return this._map(length5);
      }
      throw new Error("Could not parse");
    };
    function decode2(buffer, offset2 = 0) {
      var decoder = new Decoder(buffer, offset2);
      var value = decoder._parse();
      if (decoder._offset !== buffer.byteLength) {
        throw new Error(buffer.byteLength - decoder._offset + " trailing bytes");
      }
      return value;
    }
    exports.decode = decode2;
    var TIMESTAMP32_MAX_SEC = 4294967296 - 1;
    var TIMESTAMP64_MAX_SEC = 17179869184 - 1;
    function utf8Write(view, offset2, str5) {
      var c = 0;
      for (var i = 0, l = str5.length; i < l; i++) {
        c = str5.charCodeAt(i);
        if (c < 128) {
          view.setUint8(offset2++, c);
        } else if (c < 2048) {
          view.setUint8(offset2++, 192 | c >> 6);
          view.setUint8(offset2++, 128 | c & 63);
        } else if (c < 55296 || c >= 57344) {
          view.setUint8(offset2++, 224 | c >> 12);
          view.setUint8(offset2++, 128 | c >> 6 & 63);
          view.setUint8(offset2++, 128 | c & 63);
        } else {
          i++;
          c = 65536 + ((c & 1023) << 10 | str5.charCodeAt(i) & 1023);
          view.setUint8(offset2++, 240 | c >> 18);
          view.setUint8(offset2++, 128 | c >> 12 & 63);
          view.setUint8(offset2++, 128 | c >> 6 & 63);
          view.setUint8(offset2++, 128 | c & 63);
        }
      }
    }
    function utf8Length(str5) {
      var c = 0, length5 = 0;
      for (var i = 0, l = str5.length; i < l; i++) {
        c = str5.charCodeAt(i);
        if (c < 128) {
          length5 += 1;
        } else if (c < 2048) {
          length5 += 2;
        } else if (c < 55296 || c >= 57344) {
          length5 += 3;
        } else {
          i++;
          length5 += 4;
        }
      }
      return length5;
    }
    function _encode(bytes, defers, value) {
      var type = typeof value, i = 0, l = 0, hi = 0, lo = 0, length5 = 0, size = 0;
      if (type === "string") {
        length5 = utf8Length(value);
        if (length5 < 32) {
          bytes.push(length5 | 160);
          size = 1;
        } else if (length5 < 256) {
          bytes.push(217, length5);
          size = 2;
        } else if (length5 < 65536) {
          bytes.push(218, length5 >> 8, length5);
          size = 3;
        } else if (length5 < 4294967296) {
          bytes.push(219, length5 >> 24, length5 >> 16, length5 >> 8, length5);
          size = 5;
        } else {
          throw new Error("String too long");
        }
        defers.push({ _str: value, _length: length5, _offset: bytes.length });
        return size + length5;
      }
      if (type === "number") {
        if (Math.floor(value) !== value || !isFinite(value)) {
          bytes.push(203);
          defers.push({ _float: value, _length: 8, _offset: bytes.length });
          return 9;
        }
        if (value >= 0) {
          if (value < 128) {
            bytes.push(value);
            return 1;
          }
          if (value < 256) {
            bytes.push(204, value);
            return 2;
          }
          if (value < 65536) {
            bytes.push(205, value >> 8, value);
            return 3;
          }
          if (value < 4294967296) {
            bytes.push(206, value >> 24, value >> 16, value >> 8, value);
            return 5;
          }
          hi = value / Math.pow(2, 32) >> 0;
          lo = value >>> 0;
          bytes.push(207, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
          return 9;
        } else {
          if (value >= -32) {
            bytes.push(value);
            return 1;
          }
          if (value >= -128) {
            bytes.push(208, value);
            return 2;
          }
          if (value >= -32768) {
            bytes.push(209, value >> 8, value);
            return 3;
          }
          if (value >= -2147483648) {
            bytes.push(210, value >> 24, value >> 16, value >> 8, value);
            return 5;
          }
          hi = Math.floor(value / Math.pow(2, 32));
          lo = value >>> 0;
          bytes.push(211, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
          return 9;
        }
      }
      if (type === "object") {
        if (value === null) {
          bytes.push(192);
          return 1;
        }
        if (Array.isArray(value)) {
          length5 = value.length;
          if (length5 < 16) {
            bytes.push(length5 | 144);
            size = 1;
          } else if (length5 < 65536) {
            bytes.push(220, length5 >> 8, length5);
            size = 3;
          } else if (length5 < 4294967296) {
            bytes.push(221, length5 >> 24, length5 >> 16, length5 >> 8, length5);
            size = 5;
          } else {
            throw new Error("Array too large");
          }
          for (i = 0; i < length5; i++) {
            size += _encode(bytes, defers, value[i]);
          }
          return size;
        }
        if (value instanceof Date) {
          var ms = value.getTime();
          var s = Math.floor(ms / 1e3);
          var ns = (ms - s * 1e3) * 1e6;
          if (s >= 0 && ns >= 0 && s <= TIMESTAMP64_MAX_SEC) {
            if (ns === 0 && s <= TIMESTAMP32_MAX_SEC) {
              bytes.push(214, 255, s >> 24, s >> 16, s >> 8, s);
              return 6;
            } else {
              hi = s / 4294967296;
              lo = s & 4294967295;
              bytes.push(215, 255, ns >> 22, ns >> 14, ns >> 6, hi, lo >> 24, lo >> 16, lo >> 8, lo);
              return 10;
            }
          } else {
            hi = Math.floor(s / 4294967296);
            lo = s >>> 0;
            bytes.push(199, 12, 255, ns >> 24, ns >> 16, ns >> 8, ns, hi >> 24, hi >> 16, hi >> 8, hi, lo >> 24, lo >> 16, lo >> 8, lo);
            return 15;
          }
        }
        if (value instanceof ArrayBuffer) {
          length5 = value.byteLength;
          if (length5 < 256) {
            bytes.push(196, length5);
            size = 2;
          } else if (length5 < 65536) {
            bytes.push(197, length5 >> 8, length5);
            size = 3;
          } else if (length5 < 4294967296) {
            bytes.push(198, length5 >> 24, length5 >> 16, length5 >> 8, length5);
            size = 5;
          } else {
            throw new Error("Buffer too large");
          }
          defers.push({ _bin: value, _length: length5, _offset: bytes.length });
          return size + length5;
        }
        if (typeof value.toJSON === "function") {
          return _encode(bytes, defers, value.toJSON());
        }
        var keys = [], key = "";
        var allKeys = Object.keys(value);
        for (i = 0, l = allKeys.length; i < l; i++) {
          key = allKeys[i];
          if (value[key] !== void 0 && typeof value[key] !== "function") {
            keys.push(key);
          }
        }
        length5 = keys.length;
        if (length5 < 16) {
          bytes.push(length5 | 128);
          size = 1;
        } else if (length5 < 65536) {
          bytes.push(222, length5 >> 8, length5);
          size = 3;
        } else if (length5 < 4294967296) {
          bytes.push(223, length5 >> 24, length5 >> 16, length5 >> 8, length5);
          size = 5;
        } else {
          throw new Error("Object too large");
        }
        for (i = 0; i < length5; i++) {
          key = keys[i];
          size += _encode(bytes, defers, key);
          size += _encode(bytes, defers, value[key]);
        }
        return size;
      }
      if (type === "boolean") {
        bytes.push(value ? 195 : 194);
        return 1;
      }
      if (type === "undefined") {
        bytes.push(192);
        return 1;
      }
      if (typeof value.toJSON === "function") {
        return _encode(bytes, defers, value.toJSON());
      }
      throw new Error("Could not encode");
    }
    function encode(value) {
      var bytes = [];
      var defers = [];
      var size = _encode(bytes, defers, value);
      var buf = new ArrayBuffer(size);
      var view = new DataView(buf);
      var deferIndex = 0;
      var deferWritten = 0;
      var nextOffset = -1;
      if (defers.length > 0) {
        nextOffset = defers[0]._offset;
      }
      var defer, deferLength = 0, offset2 = 0;
      for (var i = 0, l = bytes.length; i < l; i++) {
        view.setUint8(deferWritten + i, bytes[i]);
        if (i + 1 !== nextOffset) {
          continue;
        }
        defer = defers[deferIndex];
        deferLength = defer._length;
        offset2 = deferWritten + nextOffset;
        if (defer._bin) {
          var bin = new Uint8Array(defer._bin);
          for (var j = 0; j < deferLength; j++) {
            view.setUint8(offset2 + j, bin[j]);
          }
        } else if (defer._str) {
          utf8Write(view, offset2, defer._str);
        } else if (defer._float !== void 0) {
          view.setFloat64(offset2, defer._float);
        }
        deferIndex++;
        deferWritten += deferLength;
        if (defers[deferIndex]) {
          nextOffset = defers[deferIndex]._offset;
        }
      }
      return buf;
    }
    exports.encode = encode;
  }
});

// node_modules/ws/browser.js
var require_browser = __commonJS({
  "node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// node_modules/colyseus.js/lib/transport/WebSocketTransport.js
var require_WebSocketTransport = __commonJS({
  "node_modules/colyseus.js/lib/transport/WebSocketTransport.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WebSocketTransport = void 0;
    var ws_1 = __importDefault(require_browser());
    var WebSocket = globalThis.WebSocket || ws_1.default;
    var WebSocketTransport = class {
      constructor(events) {
        this.events = events;
      }
      send(data) {
        if (data instanceof ArrayBuffer) {
          this.ws.send(data);
        } else if (Array.isArray(data)) {
          this.ws.send(new Uint8Array(data).buffer);
        }
      }
      connect(url) {
        this.ws = new WebSocket(url, this.protocols);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.events.onopen;
        this.ws.onmessage = this.events.onmessage;
        this.ws.onclose = this.events.onclose;
        this.ws.onerror = this.events.onerror;
      }
      close(code, reason) {
        this.ws.close(code, reason);
      }
      get isOpen() {
        return this.ws.readyState === WebSocket.OPEN;
      }
    };
    exports.WebSocketTransport = WebSocketTransport;
  }
});

// node_modules/colyseus.js/lib/Connection.js
var require_Connection = __commonJS({
  "node_modules/colyseus.js/lib/Connection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Connection = void 0;
    var WebSocketTransport_1 = require_WebSocketTransport();
    var Connection = class {
      constructor() {
        this.events = {};
        this.transport = new WebSocketTransport_1.WebSocketTransport(this.events);
      }
      send(data) {
        this.transport.send(data);
      }
      connect(url) {
        this.transport.connect(url);
      }
      close(code, reason) {
        this.transport.close(code, reason);
      }
      get isOpen() {
        return this.transport.isOpen;
      }
    };
    exports.Connection = Connection;
  }
});

// node_modules/colyseus.js/lib/Protocol.js
var require_Protocol = __commonJS({
  "node_modules/colyseus.js/lib/Protocol.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.utf8Length = exports.utf8Read = exports.ErrorCode = exports.Protocol = void 0;
    var Protocol;
    (function(Protocol2) {
      Protocol2[Protocol2["HANDSHAKE"] = 9] = "HANDSHAKE";
      Protocol2[Protocol2["JOIN_ROOM"] = 10] = "JOIN_ROOM";
      Protocol2[Protocol2["ERROR"] = 11] = "ERROR";
      Protocol2[Protocol2["LEAVE_ROOM"] = 12] = "LEAVE_ROOM";
      Protocol2[Protocol2["ROOM_DATA"] = 13] = "ROOM_DATA";
      Protocol2[Protocol2["ROOM_STATE"] = 14] = "ROOM_STATE";
      Protocol2[Protocol2["ROOM_STATE_PATCH"] = 15] = "ROOM_STATE_PATCH";
      Protocol2[Protocol2["ROOM_DATA_SCHEMA"] = 16] = "ROOM_DATA_SCHEMA";
      Protocol2[Protocol2["ROOM_DATA_BYTES"] = 17] = "ROOM_DATA_BYTES";
    })(Protocol = exports.Protocol || (exports.Protocol = {}));
    var ErrorCode;
    (function(ErrorCode2) {
      ErrorCode2[ErrorCode2["MATCHMAKE_NO_HANDLER"] = 4210] = "MATCHMAKE_NO_HANDLER";
      ErrorCode2[ErrorCode2["MATCHMAKE_INVALID_CRITERIA"] = 4211] = "MATCHMAKE_INVALID_CRITERIA";
      ErrorCode2[ErrorCode2["MATCHMAKE_INVALID_ROOM_ID"] = 4212] = "MATCHMAKE_INVALID_ROOM_ID";
      ErrorCode2[ErrorCode2["MATCHMAKE_UNHANDLED"] = 4213] = "MATCHMAKE_UNHANDLED";
      ErrorCode2[ErrorCode2["MATCHMAKE_EXPIRED"] = 4214] = "MATCHMAKE_EXPIRED";
      ErrorCode2[ErrorCode2["AUTH_FAILED"] = 4215] = "AUTH_FAILED";
      ErrorCode2[ErrorCode2["APPLICATION_ERROR"] = 4216] = "APPLICATION_ERROR";
    })(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
    function utf8Read(view, offset2) {
      const length5 = view[offset2++];
      var string = "", chr = 0;
      for (var i = offset2, end = offset2 + length5; i < end; i++) {
        var byte = view[i];
        if ((byte & 128) === 0) {
          string += String.fromCharCode(byte);
          continue;
        }
        if ((byte & 224) === 192) {
          string += String.fromCharCode((byte & 31) << 6 | view[++i] & 63);
          continue;
        }
        if ((byte & 240) === 224) {
          string += String.fromCharCode((byte & 15) << 12 | (view[++i] & 63) << 6 | (view[++i] & 63) << 0);
          continue;
        }
        if ((byte & 248) === 240) {
          chr = (byte & 7) << 18 | (view[++i] & 63) << 12 | (view[++i] & 63) << 6 | (view[++i] & 63) << 0;
          if (chr >= 65536) {
            chr -= 65536;
            string += String.fromCharCode((chr >>> 10) + 55296, (chr & 1023) + 56320);
          } else {
            string += String.fromCharCode(chr);
          }
          continue;
        }
        throw new Error("Invalid byte " + byte.toString(16));
      }
      return string;
    }
    exports.utf8Read = utf8Read;
    function utf8Length(str5 = "") {
      let c = 0;
      let length5 = 0;
      for (let i = 0, l = str5.length; i < l; i++) {
        c = str5.charCodeAt(i);
        if (c < 128) {
          length5 += 1;
        } else if (c < 2048) {
          length5 += 2;
        } else if (c < 55296 || c >= 57344) {
          length5 += 3;
        } else {
          i++;
          length5 += 4;
        }
      }
      return length5 + 1;
    }
    exports.utf8Length = utf8Length;
  }
});

// node_modules/colyseus.js/lib/serializer/Serializer.js
var require_Serializer = __commonJS({
  "node_modules/colyseus.js/lib/serializer/Serializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSerializer = exports.registerSerializer = void 0;
    var serializers = {};
    function registerSerializer(id, serializer) {
      serializers[id] = serializer;
    }
    exports.registerSerializer = registerSerializer;
    function getSerializer(id) {
      const serializer = serializers[id];
      if (!serializer) {
        throw new Error("missing serializer: " + id);
      }
      return serializer;
    }
    exports.getSerializer = getSerializer;
  }
});

// node_modules/colyseus.js/lib/core/nanoevents.js
var require_nanoevents = __commonJS({
  "node_modules/colyseus.js/lib/core/nanoevents.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNanoEvents = void 0;
    var createNanoEvents = () => ({
      emit(event, ...args) {
        let callbacks = this.events[event] || [];
        for (let i = 0, length5 = callbacks.length; i < length5; i++) {
          callbacks[i](...args);
        }
      },
      events: {},
      on(event, cb) {
        var _a;
        ((_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.push(cb)) || (this.events[event] = [cb]);
        return () => {
          var _a2;
          this.events[event] = (_a2 = this.events[event]) === null || _a2 === void 0 ? void 0 : _a2.filter((i) => cb !== i);
        };
      }
    });
    exports.createNanoEvents = createNanoEvents;
  }
});

// node_modules/colyseus.js/lib/core/signal.js
var require_signal = __commonJS({
  "node_modules/colyseus.js/lib/core/signal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createSignal = exports.EventEmitter = void 0;
    var EventEmitter = class {
      constructor() {
        this.handlers = [];
      }
      register(cb, once = false) {
        this.handlers.push(cb);
        return this;
      }
      invoke(...args) {
        this.handlers.forEach((handler) => handler.apply(this, args));
      }
      invokeAsync(...args) {
        return Promise.all(this.handlers.map((handler) => handler.apply(this, args)));
      }
      remove(cb) {
        const index = this.handlers.indexOf(cb);
        this.handlers[index] = this.handlers[this.handlers.length - 1];
        this.handlers.pop();
      }
      clear() {
        this.handlers = [];
      }
    };
    exports.EventEmitter = EventEmitter;
    function createSignal() {
      const emitter = new EventEmitter();
      function register(cb) {
        return emitter.register(cb, this === null);
      }
      ;
      register.once = (cb) => {
        const callback = function(...args) {
          cb.apply(this, args);
          emitter.remove(callback);
        };
        emitter.register(callback);
      };
      register.remove = (cb) => emitter.remove(cb);
      register.invoke = (...args) => emitter.invoke(...args);
      register.invokeAsync = (...args) => emitter.invokeAsync(...args);
      register.clear = () => emitter.clear();
      return register;
    }
    exports.createSignal = createSignal;
  }
});

// node_modules/@colyseus/schema/build/umd/index.js
var require_umd = __commonJS({
  "node_modules/@colyseus/schema/build/umd/index.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.schema = {}));
    })(exports, function(exports2) {
      "use strict";
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2)
            if (Object.prototype.hasOwnProperty.call(b2, p))
              d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      }
      function __decorate13(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
          r = Reflect.decorate(decorators, target, key, desc);
        else
          for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
              r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
      }
      function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
          for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
              if (!ar)
                ar = Array.prototype.slice.call(from, 0, i);
              ar[i] = from[i];
            }
          }
        return to.concat(ar || Array.prototype.slice.call(from));
      }
      typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      var SWITCH_TO_STRUCTURE = 255;
      var TYPE_ID = 213;
      exports2.OPERATION = void 0;
      (function(OPERATION) {
        OPERATION[OPERATION["ADD"] = 128] = "ADD";
        OPERATION[OPERATION["REPLACE"] = 0] = "REPLACE";
        OPERATION[OPERATION["DELETE"] = 64] = "DELETE";
        OPERATION[OPERATION["DELETE_AND_ADD"] = 192] = "DELETE_AND_ADD";
        OPERATION[OPERATION["TOUCH"] = 1] = "TOUCH";
        OPERATION[OPERATION["CLEAR"] = 10] = "CLEAR";
      })(exports2.OPERATION || (exports2.OPERATION = {}));
      var ChangeTree = (
        /** @class */
        function() {
          function ChangeTree2(ref, parent, root) {
            this.changed = false;
            this.changes = /* @__PURE__ */ new Map();
            this.allChanges = /* @__PURE__ */ new Set();
            this.caches = {};
            this.currentCustomOperation = 0;
            this.ref = ref;
            this.setParent(parent, root);
          }
          ChangeTree2.prototype.setParent = function(parent, root, parentIndex) {
            var _this = this;
            if (!this.indexes) {
              this.indexes = this.ref instanceof Schema ? this.ref["_definition"].indexes : {};
            }
            this.parent = parent;
            this.parentIndex = parentIndex;
            if (!root) {
              return;
            }
            this.root = root;
            if (this.ref instanceof Schema) {
              var definition = this.ref["_definition"];
              for (var field in definition.schema) {
                var value = this.ref[field];
                if (value && value["$changes"]) {
                  var parentIndex_1 = definition.indexes[field];
                  value["$changes"].setParent(this.ref, root, parentIndex_1);
                }
              }
            } else if (typeof this.ref === "object") {
              this.ref.forEach(function(value2, key) {
                if (value2 instanceof Schema) {
                  var changeTreee = value2["$changes"];
                  var parentIndex_2 = _this.ref["$changes"].indexes[key];
                  changeTreee.setParent(_this.ref, _this.root, parentIndex_2);
                }
              });
            }
          };
          ChangeTree2.prototype.operation = function(op) {
            this.changes.set(--this.currentCustomOperation, op);
          };
          ChangeTree2.prototype.change = function(fieldName, operation) {
            if (operation === void 0) {
              operation = exports2.OPERATION.ADD;
            }
            var index = typeof fieldName === "number" ? fieldName : this.indexes[fieldName];
            this.assertValidIndex(index, fieldName);
            var previousChange = this.changes.get(index);
            if (!previousChange || previousChange.op === exports2.OPERATION.DELETE || previousChange.op === exports2.OPERATION.TOUCH) {
              this.changes.set(index, {
                op: !previousChange ? operation : previousChange.op === exports2.OPERATION.DELETE ? exports2.OPERATION.DELETE_AND_ADD : operation,
                // : OPERATION.REPLACE,
                index
              });
            }
            this.allChanges.add(index);
            this.changed = true;
            this.touchParents();
          };
          ChangeTree2.prototype.touch = function(fieldName) {
            var index = typeof fieldName === "number" ? fieldName : this.indexes[fieldName];
            this.assertValidIndex(index, fieldName);
            if (!this.changes.has(index)) {
              this.changes.set(index, { op: exports2.OPERATION.TOUCH, index });
            }
            this.allChanges.add(index);
            this.touchParents();
          };
          ChangeTree2.prototype.touchParents = function() {
            if (this.parent) {
              this.parent["$changes"].touch(this.parentIndex);
            }
          };
          ChangeTree2.prototype.getType = function(index) {
            if (this.ref["_definition"]) {
              var definition = this.ref["_definition"];
              return definition.schema[definition.fieldsByIndex[index]];
            } else {
              var definition = this.parent["_definition"];
              var parentType = definition.schema[definition.fieldsByIndex[this.parentIndex]];
              return Object.values(parentType)[0];
            }
          };
          ChangeTree2.prototype.getChildrenFilter = function() {
            var childFilters = this.parent["_definition"].childFilters;
            return childFilters && childFilters[this.parentIndex];
          };
          ChangeTree2.prototype.getValue = function(index) {
            return this.ref["getByIndex"](index);
          };
          ChangeTree2.prototype.delete = function(fieldName) {
            var index = typeof fieldName === "number" ? fieldName : this.indexes[fieldName];
            if (index === void 0) {
              console.warn("@colyseus/schema ".concat(this.ref.constructor.name, ": trying to delete non-existing index: ").concat(fieldName, " (").concat(index, ")"));
              return;
            }
            var previousValue = this.getValue(index);
            this.changes.set(index, { op: exports2.OPERATION.DELETE, index });
            this.allChanges.delete(index);
            delete this.caches[index];
            if (previousValue && previousValue["$changes"]) {
              previousValue["$changes"].parent = void 0;
            }
            this.changed = true;
            this.touchParents();
          };
          ChangeTree2.prototype.discard = function(changed, discardAll) {
            var _this = this;
            if (changed === void 0) {
              changed = false;
            }
            if (discardAll === void 0) {
              discardAll = false;
            }
            if (!(this.ref instanceof Schema)) {
              this.changes.forEach(function(change) {
                if (change.op === exports2.OPERATION.DELETE) {
                  var index = _this.ref["getIndex"](change.index);
                  delete _this.indexes[index];
                }
              });
            }
            this.changes.clear();
            this.changed = changed;
            if (discardAll) {
              this.allChanges.clear();
            }
            this.currentCustomOperation = 0;
          };
          ChangeTree2.prototype.discardAll = function() {
            var _this = this;
            this.changes.forEach(function(change) {
              var value = _this.getValue(change.index);
              if (value && value["$changes"]) {
                value["$changes"].discardAll();
              }
            });
            this.discard();
          };
          ChangeTree2.prototype.cache = function(field, cachedBytes) {
            this.caches[field] = cachedBytes;
          };
          ChangeTree2.prototype.clone = function() {
            return new ChangeTree2(this.ref, this.parent, this.root);
          };
          ChangeTree2.prototype.ensureRefId = function() {
            if (this.refId !== void 0) {
              return;
            }
            this.refId = this.root.getNextUniqueId();
          };
          ChangeTree2.prototype.assertValidIndex = function(index, fieldName) {
            if (index === void 0) {
              throw new Error('ChangeTree: missing index for field "'.concat(fieldName, '"'));
            }
          };
          return ChangeTree2;
        }()
      );
      function addCallback($callbacks, op, callback, existing) {
        if (!$callbacks[op]) {
          $callbacks[op] = [];
        }
        $callbacks[op].push(callback);
        existing === null || existing === void 0 ? void 0 : existing.forEach(function(item, key) {
          return callback(item, key);
        });
        return function() {
          return spliceOne($callbacks[op], $callbacks[op].indexOf(callback));
        };
      }
      function removeChildRefs(changes) {
        var _this = this;
        var needRemoveRef = typeof this.$changes.getType() !== "string";
        this.$items.forEach(function(item, key) {
          changes.push({
            refId: _this.$changes.refId,
            op: exports2.OPERATION.DELETE,
            field: key,
            value: void 0,
            previousValue: item
          });
          if (needRemoveRef) {
            _this.$changes.root.removeRef(item["$changes"].refId);
          }
        });
      }
      function spliceOne(arr, index) {
        if (index === -1 || index >= arr.length) {
          return false;
        }
        var len4 = arr.length - 1;
        for (var i = index; i < len4; i++) {
          arr[i] = arr[i + 1];
        }
        arr.length = len4;
        return true;
      }
      var DEFAULT_SORT = function(a, b) {
        var A = a.toString();
        var B = b.toString();
        if (A < B)
          return -1;
        else if (A > B)
          return 1;
        else
          return 0;
      };
      function getArrayProxy(value) {
        value["$proxy"] = true;
        value = new Proxy(value, {
          get: function(obj, prop) {
            if (typeof prop !== "symbol" && !isNaN(prop)) {
              return obj.at(prop);
            } else {
              return obj[prop];
            }
          },
          set: function(obj, prop, setValue) {
            if (typeof prop !== "symbol" && !isNaN(prop)) {
              var indexes = Array.from(obj["$items"].keys());
              var key = parseInt(indexes[prop] || prop);
              if (setValue === void 0 || setValue === null) {
                obj.deleteAt(key);
              } else {
                obj.setAt(key, setValue);
              }
            } else {
              obj[prop] = setValue;
            }
            return true;
          },
          deleteProperty: function(obj, prop) {
            if (typeof prop === "number") {
              obj.deleteAt(prop);
            } else {
              delete obj[prop];
            }
            return true;
          },
          has: function(obj, key) {
            if (typeof key !== "symbol" && !isNaN(Number(key))) {
              return obj["$items"].has(Number(key));
            }
            return Reflect.has(obj, key);
          }
        });
        return value;
      }
      var ArraySchema = (
        /** @class */
        function() {
          function ArraySchema2() {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
            }
            this.$changes = new ChangeTree(this);
            this.$items = /* @__PURE__ */ new Map();
            this.$indexes = /* @__PURE__ */ new Map();
            this.$refId = 0;
            this.push.apply(this, items);
          }
          ArraySchema2.prototype.onAdd = function(callback, triggerAll) {
            if (triggerAll === void 0) {
              triggerAll = true;
            }
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.ADD, callback, triggerAll ? this.$items : void 0);
          };
          ArraySchema2.prototype.onRemove = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.DELETE, callback);
          };
          ArraySchema2.prototype.onChange = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.REPLACE, callback);
          };
          ArraySchema2.is = function(type2) {
            return (
              // type format: ["string"]
              Array.isArray(type2) || // type format: { array: "string" }
              type2["array"] !== void 0
            );
          };
          Object.defineProperty(ArraySchema2.prototype, "length", {
            get: function() {
              return this.$items.size;
            },
            set: function(value) {
              if (value === 0) {
                this.clear();
              } else {
                this.splice(value, this.length - value);
              }
            },
            enumerable: false,
            configurable: true
          });
          ArraySchema2.prototype.push = function() {
            var _this = this;
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              values[_i] = arguments[_i];
            }
            var lastIndex;
            values.forEach(function(value) {
              lastIndex = _this.$refId++;
              _this.setAt(lastIndex, value);
            });
            return lastIndex;
          };
          ArraySchema2.prototype.pop = function() {
            var key = Array.from(this.$indexes.values()).pop();
            if (key === void 0) {
              return void 0;
            }
            this.$changes.delete(key);
            this.$indexes.delete(key);
            var value = this.$items.get(key);
            this.$items.delete(key);
            return value;
          };
          ArraySchema2.prototype.at = function(index) {
            index = Math.trunc(index) || 0;
            if (index < 0)
              index += this.length;
            if (index < 0 || index >= this.length)
              return void 0;
            var key = Array.from(this.$items.keys())[index];
            return this.$items.get(key);
          };
          ArraySchema2.prototype.setAt = function(index, value) {
            var _a, _b;
            if (value === void 0 || value === null) {
              console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");
              return;
            }
            if (this.$items.get(index) === value) {
              return;
            }
            if (value["$changes"] !== void 0) {
              value["$changes"].setParent(this, this.$changes.root, index);
            }
            var operation = (_b = (_a = this.$changes.indexes[index]) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : exports2.OPERATION.ADD;
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index, operation);
          };
          ArraySchema2.prototype.deleteAt = function(index) {
            var key = Array.from(this.$items.keys())[index];
            if (key === void 0) {
              return false;
            }
            return this.$deleteAt(key);
          };
          ArraySchema2.prototype.$deleteAt = function(index) {
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
          };
          ArraySchema2.prototype.clear = function(changes) {
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            this.$indexes.clear();
            if (changes) {
              removeChildRefs.call(this, changes);
            }
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports2.OPERATION.CLEAR });
            this.$changes.touchParents();
          };
          ArraySchema2.prototype.concat = function() {
            var _a;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
            }
            return new (ArraySchema2.bind.apply(ArraySchema2, __spreadArray([void 0], (_a = Array.from(this.$items.values())).concat.apply(_a, items), false)))();
          };
          ArraySchema2.prototype.join = function(separator) {
            return Array.from(this.$items.values()).join(separator);
          };
          ArraySchema2.prototype.reverse = function() {
            var _this = this;
            var indexes = Array.from(this.$items.keys());
            var reversedItems = Array.from(this.$items.values()).reverse();
            reversedItems.forEach(function(item, i) {
              _this.setAt(indexes[i], item);
            });
            return this;
          };
          ArraySchema2.prototype.shift = function() {
            var indexes = Array.from(this.$items.keys());
            var shiftAt = indexes.shift();
            if (shiftAt === void 0) {
              return void 0;
            }
            var value = this.$items.get(shiftAt);
            this.$deleteAt(shiftAt);
            return value;
          };
          ArraySchema2.prototype.slice = function(start, end) {
            var sliced = new ArraySchema2();
            sliced.push.apply(sliced, Array.from(this.$items.values()).slice(start, end));
            return sliced;
          };
          ArraySchema2.prototype.sort = function(compareFn) {
            var _this = this;
            if (compareFn === void 0) {
              compareFn = DEFAULT_SORT;
            }
            var indexes = Array.from(this.$items.keys());
            var sortedItems = Array.from(this.$items.values()).sort(compareFn);
            sortedItems.forEach(function(item, i) {
              _this.setAt(indexes[i], item);
            });
            return this;
          };
          ArraySchema2.prototype.splice = function(start, deleteCount) {
            if (deleteCount === void 0) {
              deleteCount = this.length - start;
            }
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              items[_i - 2] = arguments[_i];
            }
            var indexes = Array.from(this.$items.keys());
            var removedItems = [];
            for (var i = start; i < start + deleteCount; i++) {
              removedItems.push(this.$items.get(indexes[i]));
              this.$deleteAt(indexes[i]);
            }
            for (var i = 0; i < items.length; i++) {
              this.setAt(start + i, items[i]);
            }
            return removedItems;
          };
          ArraySchema2.prototype.unshift = function() {
            var _this = this;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              items[_i] = arguments[_i];
            }
            var length5 = this.length;
            var addedLength = items.length;
            var previousValues = Array.from(this.$items.values());
            items.forEach(function(item, i) {
              _this.setAt(i, item);
            });
            previousValues.forEach(function(previousValue, i) {
              _this.setAt(addedLength + i, previousValue);
            });
            return length5 + addedLength;
          };
          ArraySchema2.prototype.indexOf = function(searchElement, fromIndex) {
            return Array.from(this.$items.values()).indexOf(searchElement, fromIndex);
          };
          ArraySchema2.prototype.lastIndexOf = function(searchElement, fromIndex) {
            if (fromIndex === void 0) {
              fromIndex = this.length - 1;
            }
            return Array.from(this.$items.values()).lastIndexOf(searchElement, fromIndex);
          };
          ArraySchema2.prototype.every = function(callbackfn, thisArg) {
            return Array.from(this.$items.values()).every(callbackfn, thisArg);
          };
          ArraySchema2.prototype.some = function(callbackfn, thisArg) {
            return Array.from(this.$items.values()).some(callbackfn, thisArg);
          };
          ArraySchema2.prototype.forEach = function(callbackfn, thisArg) {
            Array.from(this.$items.values()).forEach(callbackfn, thisArg);
          };
          ArraySchema2.prototype.map = function(callbackfn, thisArg) {
            return Array.from(this.$items.values()).map(callbackfn, thisArg);
          };
          ArraySchema2.prototype.filter = function(callbackfn, thisArg) {
            return Array.from(this.$items.values()).filter(callbackfn, thisArg);
          };
          ArraySchema2.prototype.reduce = function(callbackfn, initialValue) {
            return Array.prototype.reduce.apply(Array.from(this.$items.values()), arguments);
          };
          ArraySchema2.prototype.reduceRight = function(callbackfn, initialValue) {
            return Array.prototype.reduceRight.apply(Array.from(this.$items.values()), arguments);
          };
          ArraySchema2.prototype.find = function(predicate, thisArg) {
            return Array.from(this.$items.values()).find(predicate, thisArg);
          };
          ArraySchema2.prototype.findIndex = function(predicate, thisArg) {
            return Array.from(this.$items.values()).findIndex(predicate, thisArg);
          };
          ArraySchema2.prototype.fill = function(value, start, end) {
            throw new Error("ArraySchema#fill() not implemented");
          };
          ArraySchema2.prototype.copyWithin = function(target, start, end) {
            throw new Error("ArraySchema#copyWithin() not implemented");
          };
          ArraySchema2.prototype.toString = function() {
            return this.$items.toString();
          };
          ArraySchema2.prototype.toLocaleString = function() {
            return this.$items.toLocaleString();
          };
          ArraySchema2.prototype[Symbol.iterator] = function() {
            return Array.from(this.$items.values())[Symbol.iterator]();
          };
          Object.defineProperty(ArraySchema2, Symbol.species, {
            get: function() {
              return ArraySchema2;
            },
            enumerable: false,
            configurable: true
          });
          ArraySchema2.prototype.entries = function() {
            return this.$items.entries();
          };
          ArraySchema2.prototype.keys = function() {
            return this.$items.keys();
          };
          ArraySchema2.prototype.values = function() {
            return this.$items.values();
          };
          ArraySchema2.prototype.includes = function(searchElement, fromIndex) {
            return Array.from(this.$items.values()).includes(searchElement, fromIndex);
          };
          ArraySchema2.prototype.flatMap = function(callback, thisArg) {
            throw new Error("ArraySchema#flatMap() is not supported.");
          };
          ArraySchema2.prototype.flat = function(depth) {
            throw new Error("ArraySchema#flat() is not supported.");
          };
          ArraySchema2.prototype.findLast = function() {
            var arr = Array.from(this.$items.values());
            return arr.findLast.apply(arr, arguments);
          };
          ArraySchema2.prototype.findLastIndex = function() {
            var arr = Array.from(this.$items.values());
            return arr.findLastIndex.apply(arr, arguments);
          };
          ArraySchema2.prototype.with = function(index, value) {
            var copy6 = Array.from(this.$items.values());
            copy6[index] = value;
            return new (ArraySchema2.bind.apply(ArraySchema2, __spreadArray([void 0], copy6, false)))();
          };
          ArraySchema2.prototype.toReversed = function() {
            return Array.from(this.$items.values()).reverse();
          };
          ArraySchema2.prototype.toSorted = function(compareFn) {
            return Array.from(this.$items.values()).sort(compareFn);
          };
          ArraySchema2.prototype.toSpliced = function(start, deleteCount) {
            var copy6 = Array.from(this.$items.values());
            return copy6.toSpliced.apply(copy6, arguments);
          };
          ArraySchema2.prototype.setIndex = function(index, key) {
            this.$indexes.set(index, key);
          };
          ArraySchema2.prototype.getIndex = function(index) {
            return this.$indexes.get(index);
          };
          ArraySchema2.prototype.getByIndex = function(index) {
            return this.$items.get(this.$indexes.get(index));
          };
          ArraySchema2.prototype.deleteByIndex = function(index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
          };
          ArraySchema2.prototype.toArray = function() {
            return Array.from(this.$items.values());
          };
          ArraySchema2.prototype.toJSON = function() {
            return this.toArray().map(function(value) {
              return typeof value["toJSON"] === "function" ? value["toJSON"]() : value;
            });
          };
          ArraySchema2.prototype.clone = function(isDecoding) {
            var cloned;
            if (isDecoding) {
              cloned = new (ArraySchema2.bind.apply(ArraySchema2, __spreadArray([void 0], Array.from(this.$items.values()), false)))();
            } else {
              cloned = new (ArraySchema2.bind.apply(ArraySchema2, __spreadArray([void 0], this.map(function(item) {
                return item["$changes"] ? item.clone() : item;
              }), false)))();
            }
            return cloned;
          };
          return ArraySchema2;
        }()
      );
      function getMapProxy(value) {
        value["$proxy"] = true;
        value = new Proxy(value, {
          get: function(obj, prop) {
            if (typeof prop !== "symbol" && // accessing properties
            typeof obj[prop] === "undefined") {
              return obj.get(prop);
            } else {
              return obj[prop];
            }
          },
          set: function(obj, prop, setValue) {
            if (typeof prop !== "symbol" && (prop.indexOf("$") === -1 && prop !== "onAdd" && prop !== "onRemove" && prop !== "onChange")) {
              obj.set(prop, setValue);
            } else {
              obj[prop] = setValue;
            }
            return true;
          },
          deleteProperty: function(obj, prop) {
            obj.delete(prop);
            return true;
          }
        });
        return value;
      }
      var MapSchema = (
        /** @class */
        function() {
          function MapSchema2(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = /* @__PURE__ */ new Map();
            this.$indexes = /* @__PURE__ */ new Map();
            this.$refId = 0;
            if (initialValues) {
              if (initialValues instanceof Map || initialValues instanceof MapSchema2) {
                initialValues.forEach(function(v, k2) {
                  return _this.set(k2, v);
                });
              } else {
                for (var k in initialValues) {
                  this.set(k, initialValues[k]);
                }
              }
            }
          }
          MapSchema2.prototype.onAdd = function(callback, triggerAll) {
            if (triggerAll === void 0) {
              triggerAll = true;
            }
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.ADD, callback, triggerAll ? this.$items : void 0);
          };
          MapSchema2.prototype.onRemove = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.DELETE, callback);
          };
          MapSchema2.prototype.onChange = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.REPLACE, callback);
          };
          MapSchema2.is = function(type2) {
            return type2["map"] !== void 0;
          };
          MapSchema2.prototype[Symbol.iterator] = function() {
            return this.$items[Symbol.iterator]();
          };
          Object.defineProperty(MapSchema2.prototype, Symbol.toStringTag, {
            get: function() {
              return this.$items[Symbol.toStringTag];
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(MapSchema2, Symbol.species, {
            get: function() {
              return MapSchema2;
            },
            enumerable: false,
            configurable: true
          });
          MapSchema2.prototype.set = function(key, value) {
            if (value === void 0 || value === null) {
              throw new Error("MapSchema#set('".concat(key, "', ").concat(value, "): trying to set ").concat(value, " value on '").concat(key, "'."));
            }
            key = key.toString();
            var hasIndex = typeof this.$changes.indexes[key] !== "undefined";
            var index = hasIndex ? this.$changes.indexes[key] : this.$refId++;
            var operation = hasIndex ? exports2.OPERATION.REPLACE : exports2.OPERATION.ADD;
            var isRef = value["$changes"] !== void 0;
            if (isRef) {
              value["$changes"].setParent(this, this.$changes.root, index);
            }
            if (!hasIndex) {
              this.$changes.indexes[key] = index;
              this.$indexes.set(index, key);
            } else if (!isRef && this.$items.get(key) === value) {
              return;
            } else if (isRef && // if is schema, force ADD operation if value differ from previous one.
            this.$items.get(key) !== value) {
              operation = exports2.OPERATION.ADD;
            }
            this.$items.set(key, value);
            this.$changes.change(key, operation);
            return this;
          };
          MapSchema2.prototype.get = function(key) {
            return this.$items.get(key);
          };
          MapSchema2.prototype.delete = function(key) {
            this.$changes.delete(key.toString());
            return this.$items.delete(key);
          };
          MapSchema2.prototype.clear = function(changes) {
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            this.$indexes.clear();
            if (changes) {
              removeChildRefs.call(this, changes);
            }
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports2.OPERATION.CLEAR });
            this.$changes.touchParents();
          };
          MapSchema2.prototype.has = function(key) {
            return this.$items.has(key);
          };
          MapSchema2.prototype.forEach = function(callbackfn) {
            this.$items.forEach(callbackfn);
          };
          MapSchema2.prototype.entries = function() {
            return this.$items.entries();
          };
          MapSchema2.prototype.keys = function() {
            return this.$items.keys();
          };
          MapSchema2.prototype.values = function() {
            return this.$items.values();
          };
          Object.defineProperty(MapSchema2.prototype, "size", {
            get: function() {
              return this.$items.size;
            },
            enumerable: false,
            configurable: true
          });
          MapSchema2.prototype.setIndex = function(index, key) {
            this.$indexes.set(index, key);
          };
          MapSchema2.prototype.getIndex = function(index) {
            return this.$indexes.get(index);
          };
          MapSchema2.prototype.getByIndex = function(index) {
            return this.$items.get(this.$indexes.get(index));
          };
          MapSchema2.prototype.deleteByIndex = function(index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
          };
          MapSchema2.prototype.toJSON = function() {
            var map = {};
            this.forEach(function(value, key) {
              map[key] = typeof value["toJSON"] === "function" ? value["toJSON"]() : value;
            });
            return map;
          };
          MapSchema2.prototype.clone = function(isDecoding) {
            var cloned;
            if (isDecoding) {
              cloned = Object.assign(new MapSchema2(), this);
            } else {
              cloned = new MapSchema2();
              this.forEach(function(value, key) {
                if (value["$changes"]) {
                  cloned.set(key, value["clone"]());
                } else {
                  cloned.set(key, value);
                }
              });
            }
            return cloned;
          };
          return MapSchema2;
        }()
      );
      var registeredTypes = {};
      function registerType(identifier, definition) {
        registeredTypes[identifier] = definition;
      }
      function getType(identifier) {
        return registeredTypes[identifier];
      }
      var SchemaDefinition = (
        /** @class */
        function() {
          function SchemaDefinition2() {
            this.indexes = {};
            this.fieldsByIndex = {};
            this.deprecated = {};
            this.descriptors = {};
          }
          SchemaDefinition2.create = function(parent) {
            var definition = new SchemaDefinition2();
            definition.schema = Object.assign({}, parent && parent.schema || {});
            definition.indexes = Object.assign({}, parent && parent.indexes || {});
            definition.fieldsByIndex = Object.assign({}, parent && parent.fieldsByIndex || {});
            definition.descriptors = Object.assign({}, parent && parent.descriptors || {});
            definition.deprecated = Object.assign({}, parent && parent.deprecated || {});
            return definition;
          };
          SchemaDefinition2.prototype.addField = function(field, type2) {
            var index = this.getNextFieldIndex();
            this.fieldsByIndex[index] = field;
            this.indexes[field] = index;
            this.schema[field] = Array.isArray(type2) ? { array: type2[0] } : type2;
          };
          SchemaDefinition2.prototype.hasField = function(field) {
            return this.indexes[field] !== void 0;
          };
          SchemaDefinition2.prototype.addFilter = function(field, cb) {
            if (!this.filters) {
              this.filters = {};
              this.indexesWithFilters = [];
            }
            this.filters[this.indexes[field]] = cb;
            this.indexesWithFilters.push(this.indexes[field]);
            return true;
          };
          SchemaDefinition2.prototype.addChildrenFilter = function(field, cb) {
            var index = this.indexes[field];
            var type2 = this.schema[field];
            if (getType(Object.keys(type2)[0])) {
              if (!this.childFilters) {
                this.childFilters = {};
              }
              this.childFilters[index] = cb;
              return true;
            } else {
              console.warn("@filterChildren: field '".concat(field, "' can't have children. Ignoring filter."));
            }
          };
          SchemaDefinition2.prototype.getChildrenFilter = function(field) {
            return this.childFilters && this.childFilters[this.indexes[field]];
          };
          SchemaDefinition2.prototype.getNextFieldIndex = function() {
            return Object.keys(this.schema || {}).length;
          };
          return SchemaDefinition2;
        }()
      );
      function hasFilter(klass) {
        return klass._context && klass._context.useFilters;
      }
      var Context = (
        /** @class */
        function() {
          function Context2() {
            this.types = {};
            this.schemas = /* @__PURE__ */ new Map();
            this.useFilters = false;
          }
          Context2.prototype.has = function(schema) {
            return this.schemas.has(schema);
          };
          Context2.prototype.get = function(typeid) {
            return this.types[typeid];
          };
          Context2.prototype.add = function(schema, typeid) {
            if (typeid === void 0) {
              typeid = this.schemas.size;
            }
            schema._definition = SchemaDefinition.create(schema._definition);
            schema._typeid = typeid;
            this.types[typeid] = schema;
            this.schemas.set(schema, typeid);
          };
          Context2.create = function(options) {
            if (options === void 0) {
              options = {};
            }
            return function(definition) {
              if (!options.context) {
                options.context = new Context2();
              }
              return type(definition, options);
            };
          };
          return Context2;
        }()
      );
      var globalContext = new Context();
      function type(type2, options) {
        if (options === void 0) {
          options = {};
        }
        return function(target, field) {
          var context = options.context || globalContext;
          var constructor = target.constructor;
          constructor._context = context;
          if (!type2) {
            throw new Error("".concat(constructor.name, ': @type() reference provided for "').concat(field, `" is undefined. Make sure you don't have any circular dependencies.`));
          }
          if (!context.has(constructor)) {
            context.add(constructor);
          }
          var definition = constructor._definition;
          definition.addField(field, type2);
          if (definition.descriptors[field]) {
            if (definition.deprecated[field]) {
              return;
            } else {
              try {
                throw new Error("@colyseus/schema: Duplicate '".concat(field, "' definition on '").concat(constructor.name, "'.\nCheck @type() annotation"));
              } catch (e) {
                var definitionAtLine = e.stack.split("\n")[4].trim();
                throw new Error("".concat(e.message, " ").concat(definitionAtLine));
              }
            }
          }
          var isArray = ArraySchema.is(type2);
          var isMap = !isArray && MapSchema.is(type2);
          if (typeof type2 !== "string" && !Schema.is(type2)) {
            var childType = Object.values(type2)[0];
            if (typeof childType !== "string" && !context.has(childType)) {
              context.add(childType);
            }
          }
          if (options.manual) {
            definition.descriptors[field] = {
              enumerable: true,
              configurable: true,
              writable: true
            };
            return;
          }
          var fieldCached = "_".concat(field);
          definition.descriptors[fieldCached] = {
            enumerable: false,
            configurable: false,
            writable: true
          };
          definition.descriptors[field] = {
            get: function() {
              return this[fieldCached];
            },
            set: function(value) {
              if (value === this[fieldCached]) {
                return;
              }
              if (value !== void 0 && value !== null) {
                if (isArray && !(value instanceof ArraySchema)) {
                  value = new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], value, false)))();
                }
                if (isMap && !(value instanceof MapSchema)) {
                  value = new MapSchema(value);
                }
                if (value["$proxy"] === void 0) {
                  if (isMap) {
                    value = getMapProxy(value);
                  } else if (isArray) {
                    value = getArrayProxy(value);
                  }
                }
                this.$changes.change(field);
                if (value["$changes"]) {
                  value["$changes"].setParent(this, this.$changes.root, this._definition.indexes[field]);
                }
              } else if (this[fieldCached]) {
                this.$changes.delete(field);
              }
              this[fieldCached] = value;
            },
            enumerable: true,
            configurable: true
          };
        };
      }
      function filter(cb) {
        return function(target, field) {
          var constructor = target.constructor;
          var definition = constructor._definition;
          if (definition.addFilter(field, cb)) {
            constructor._context.useFilters = true;
          }
        };
      }
      function filterChildren(cb) {
        return function(target, field) {
          var constructor = target.constructor;
          var definition = constructor._definition;
          if (definition.addChildrenFilter(field, cb)) {
            constructor._context.useFilters = true;
          }
        };
      }
      function deprecated(throws) {
        if (throws === void 0) {
          throws = true;
        }
        return function(target, field) {
          var constructor = target.constructor;
          var definition = constructor._definition;
          definition.deprecated[field] = true;
          if (throws) {
            definition.descriptors[field] = {
              get: function() {
                throw new Error("".concat(field, " is deprecated."));
              },
              set: function(value) {
              },
              enumerable: false,
              configurable: true
            };
          }
        };
      }
      function defineTypes(target, fields, options) {
        if (options === void 0) {
          options = {};
        }
        if (!options.context) {
          options.context = target._context || options.context || globalContext;
        }
        for (var field in fields) {
          type(fields[field], options)(target.prototype, field);
        }
        return target;
      }
      function utf8Length(str5) {
        var c = 0, length5 = 0;
        for (var i = 0, l = str5.length; i < l; i++) {
          c = str5.charCodeAt(i);
          if (c < 128) {
            length5 += 1;
          } else if (c < 2048) {
            length5 += 2;
          } else if (c < 55296 || c >= 57344) {
            length5 += 3;
          } else {
            i++;
            length5 += 4;
          }
        }
        return length5;
      }
      function utf8Write(view, offset2, str5) {
        var c = 0;
        for (var i = 0, l = str5.length; i < l; i++) {
          c = str5.charCodeAt(i);
          if (c < 128) {
            view[offset2++] = c;
          } else if (c < 2048) {
            view[offset2++] = 192 | c >> 6;
            view[offset2++] = 128 | c & 63;
          } else if (c < 55296 || c >= 57344) {
            view[offset2++] = 224 | c >> 12;
            view[offset2++] = 128 | c >> 6 & 63;
            view[offset2++] = 128 | c & 63;
          } else {
            i++;
            c = 65536 + ((c & 1023) << 10 | str5.charCodeAt(i) & 1023);
            view[offset2++] = 240 | c >> 18;
            view[offset2++] = 128 | c >> 12 & 63;
            view[offset2++] = 128 | c >> 6 & 63;
            view[offset2++] = 128 | c & 63;
          }
        }
      }
      function int8$1(bytes, value) {
        bytes.push(value & 255);
      }
      function uint8$1(bytes, value) {
        bytes.push(value & 255);
      }
      function int16$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push(value >> 8 & 255);
      }
      function uint16$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push(value >> 8 & 255);
      }
      function int32$1(bytes, value) {
        bytes.push(value & 255);
        bytes.push(value >> 8 & 255);
        bytes.push(value >> 16 & 255);
        bytes.push(value >> 24 & 255);
      }
      function uint32$1(bytes, value) {
        var b4 = value >> 24;
        var b3 = value >> 16;
        var b2 = value >> 8;
        var b1 = value;
        bytes.push(b1 & 255);
        bytes.push(b2 & 255);
        bytes.push(b3 & 255);
        bytes.push(b4 & 255);
      }
      function int64$1(bytes, value) {
        var high = Math.floor(value / Math.pow(2, 32));
        var low = value >>> 0;
        uint32$1(bytes, low);
        uint32$1(bytes, high);
      }
      function uint64$1(bytes, value) {
        var high = value / Math.pow(2, 32) >> 0;
        var low = value >>> 0;
        uint32$1(bytes, low);
        uint32$1(bytes, high);
      }
      function float32$1(bytes, value) {
        writeFloat32(bytes, value);
      }
      function float64$1(bytes, value) {
        writeFloat64(bytes, value);
      }
      var _int32$1 = new Int32Array(2);
      var _float32$1 = new Float32Array(_int32$1.buffer);
      var _float64$1 = new Float64Array(_int32$1.buffer);
      function writeFloat32(bytes, value) {
        _float32$1[0] = value;
        int32$1(bytes, _int32$1[0]);
      }
      function writeFloat64(bytes, value) {
        _float64$1[0] = value;
        int32$1(bytes, _int32$1[0]);
        int32$1(bytes, _int32$1[1]);
      }
      function boolean$1(bytes, value) {
        return uint8$1(bytes, value ? 1 : 0);
      }
      function string$1(bytes, value) {
        if (!value) {
          value = "";
        }
        var length5 = utf8Length(value);
        var size = 0;
        if (length5 < 32) {
          bytes.push(length5 | 160);
          size = 1;
        } else if (length5 < 256) {
          bytes.push(217);
          uint8$1(bytes, length5);
          size = 2;
        } else if (length5 < 65536) {
          bytes.push(218);
          uint16$1(bytes, length5);
          size = 3;
        } else if (length5 < 4294967296) {
          bytes.push(219);
          uint32$1(bytes, length5);
          size = 5;
        } else {
          throw new Error("String too long");
        }
        utf8Write(bytes, bytes.length, value);
        return size + length5;
      }
      function number$1(bytes, value) {
        if (isNaN(value)) {
          return number$1(bytes, 0);
        } else if (!isFinite(value)) {
          return number$1(bytes, value > 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER);
        } else if (value !== (value | 0)) {
          bytes.push(203);
          writeFloat64(bytes, value);
          return 9;
        }
        if (value >= 0) {
          if (value < 128) {
            uint8$1(bytes, value);
            return 1;
          }
          if (value < 256) {
            bytes.push(204);
            uint8$1(bytes, value);
            return 2;
          }
          if (value < 65536) {
            bytes.push(205);
            uint16$1(bytes, value);
            return 3;
          }
          if (value < 4294967296) {
            bytes.push(206);
            uint32$1(bytes, value);
            return 5;
          }
          bytes.push(207);
          uint64$1(bytes, value);
          return 9;
        } else {
          if (value >= -32) {
            bytes.push(224 | value + 32);
            return 1;
          }
          if (value >= -128) {
            bytes.push(208);
            int8$1(bytes, value);
            return 2;
          }
          if (value >= -32768) {
            bytes.push(209);
            int16$1(bytes, value);
            return 3;
          }
          if (value >= -2147483648) {
            bytes.push(210);
            int32$1(bytes, value);
            return 5;
          }
          bytes.push(211);
          int64$1(bytes, value);
          return 9;
        }
      }
      var encode = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        boolean: boolean$1,
        float32: float32$1,
        float64: float64$1,
        int16: int16$1,
        int32: int32$1,
        int64: int64$1,
        int8: int8$1,
        number: number$1,
        string: string$1,
        uint16: uint16$1,
        uint32: uint32$1,
        uint64: uint64$1,
        uint8: uint8$1,
        utf8Write,
        writeFloat32,
        writeFloat64
      });
      function utf8Read(bytes, offset2, length5) {
        var string2 = "", chr = 0;
        for (var i = offset2, end = offset2 + length5; i < end; i++) {
          var byte = bytes[i];
          if ((byte & 128) === 0) {
            string2 += String.fromCharCode(byte);
            continue;
          }
          if ((byte & 224) === 192) {
            string2 += String.fromCharCode((byte & 31) << 6 | bytes[++i] & 63);
            continue;
          }
          if ((byte & 240) === 224) {
            string2 += String.fromCharCode((byte & 15) << 12 | (bytes[++i] & 63) << 6 | (bytes[++i] & 63) << 0);
            continue;
          }
          if ((byte & 248) === 240) {
            chr = (byte & 7) << 18 | (bytes[++i] & 63) << 12 | (bytes[++i] & 63) << 6 | (bytes[++i] & 63) << 0;
            if (chr >= 65536) {
              chr -= 65536;
              string2 += String.fromCharCode((chr >>> 10) + 55296, (chr & 1023) + 56320);
            } else {
              string2 += String.fromCharCode(chr);
            }
            continue;
          }
          console.error("Invalid byte " + byte.toString(16));
        }
        return string2;
      }
      function int8(bytes, it) {
        return uint8(bytes, it) << 24 >> 24;
      }
      function uint8(bytes, it) {
        return bytes[it.offset++];
      }
      function int16(bytes, it) {
        return uint16(bytes, it) << 16 >> 16;
      }
      function uint16(bytes, it) {
        return bytes[it.offset++] | bytes[it.offset++] << 8;
      }
      function int32(bytes, it) {
        return bytes[it.offset++] | bytes[it.offset++] << 8 | bytes[it.offset++] << 16 | bytes[it.offset++] << 24;
      }
      function uint32(bytes, it) {
        return int32(bytes, it) >>> 0;
      }
      function float32(bytes, it) {
        return readFloat32(bytes, it);
      }
      function float64(bytes, it) {
        return readFloat64(bytes, it);
      }
      function int64(bytes, it) {
        var low = uint32(bytes, it);
        var high = int32(bytes, it) * Math.pow(2, 32);
        return high + low;
      }
      function uint64(bytes, it) {
        var low = uint32(bytes, it);
        var high = uint32(bytes, it) * Math.pow(2, 32);
        return high + low;
      }
      var _int32 = new Int32Array(2);
      var _float32 = new Float32Array(_int32.buffer);
      var _float64 = new Float64Array(_int32.buffer);
      function readFloat32(bytes, it) {
        _int32[0] = int32(bytes, it);
        return _float32[0];
      }
      function readFloat64(bytes, it) {
        _int32[0] = int32(bytes, it);
        _int32[1] = int32(bytes, it);
        return _float64[0];
      }
      function boolean(bytes, it) {
        return uint8(bytes, it) > 0;
      }
      function string(bytes, it) {
        var prefix = bytes[it.offset++];
        var length5;
        if (prefix < 192) {
          length5 = prefix & 31;
        } else if (prefix === 217) {
          length5 = uint8(bytes, it);
        } else if (prefix === 218) {
          length5 = uint16(bytes, it);
        } else if (prefix === 219) {
          length5 = uint32(bytes, it);
        }
        var value = utf8Read(bytes, it.offset, length5);
        it.offset += length5;
        return value;
      }
      function stringCheck(bytes, it) {
        var prefix = bytes[it.offset];
        return (
          // fixstr
          prefix < 192 && prefix > 160 || // str 8
          prefix === 217 || // str 16
          prefix === 218 || // str 32
          prefix === 219
        );
      }
      function number(bytes, it) {
        var prefix = bytes[it.offset++];
        if (prefix < 128) {
          return prefix;
        } else if (prefix === 202) {
          return readFloat32(bytes, it);
        } else if (prefix === 203) {
          return readFloat64(bytes, it);
        } else if (prefix === 204) {
          return uint8(bytes, it);
        } else if (prefix === 205) {
          return uint16(bytes, it);
        } else if (prefix === 206) {
          return uint32(bytes, it);
        } else if (prefix === 207) {
          return uint64(bytes, it);
        } else if (prefix === 208) {
          return int8(bytes, it);
        } else if (prefix === 209) {
          return int16(bytes, it);
        } else if (prefix === 210) {
          return int32(bytes, it);
        } else if (prefix === 211) {
          return int64(bytes, it);
        } else if (prefix > 223) {
          return (255 - prefix + 1) * -1;
        }
      }
      function numberCheck(bytes, it) {
        var prefix = bytes[it.offset];
        return prefix < 128 || prefix >= 202 && prefix <= 211;
      }
      function arrayCheck(bytes, it) {
        return bytes[it.offset] < 160;
      }
      function switchStructureCheck(bytes, it) {
        return (
          // previous byte should be `SWITCH_TO_STRUCTURE`
          bytes[it.offset - 1] === SWITCH_TO_STRUCTURE && // next byte should be a number
          (bytes[it.offset] < 128 || bytes[it.offset] >= 202 && bytes[it.offset] <= 211)
        );
      }
      var decode2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        arrayCheck,
        boolean,
        float32,
        float64,
        int16,
        int32,
        int64,
        int8,
        number,
        numberCheck,
        readFloat32,
        readFloat64,
        string,
        stringCheck,
        switchStructureCheck,
        uint16,
        uint32,
        uint64,
        uint8
      });
      var CollectionSchema = (
        /** @class */
        function() {
          function CollectionSchema2(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = /* @__PURE__ */ new Map();
            this.$indexes = /* @__PURE__ */ new Map();
            this.$refId = 0;
            if (initialValues) {
              initialValues.forEach(function(v) {
                return _this.add(v);
              });
            }
          }
          CollectionSchema2.prototype.onAdd = function(callback, triggerAll) {
            if (triggerAll === void 0) {
              triggerAll = true;
            }
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.ADD, callback, triggerAll ? this.$items : void 0);
          };
          CollectionSchema2.prototype.onRemove = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.DELETE, callback);
          };
          CollectionSchema2.prototype.onChange = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.REPLACE, callback);
          };
          CollectionSchema2.is = function(type2) {
            return type2["collection"] !== void 0;
          };
          CollectionSchema2.prototype.add = function(value) {
            var index = this.$refId++;
            var isRef = value["$changes"] !== void 0;
            if (isRef) {
              value["$changes"].setParent(this, this.$changes.root, index);
            }
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index);
            return index;
          };
          CollectionSchema2.prototype.at = function(index) {
            var key = Array.from(this.$items.keys())[index];
            return this.$items.get(key);
          };
          CollectionSchema2.prototype.entries = function() {
            return this.$items.entries();
          };
          CollectionSchema2.prototype.delete = function(item) {
            var entries = this.$items.entries();
            var index;
            var entry;
            while (entry = entries.next()) {
              if (entry.done) {
                break;
              }
              if (item === entry.value[1]) {
                index = entry.value[0];
                break;
              }
            }
            if (index === void 0) {
              return false;
            }
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
          };
          CollectionSchema2.prototype.clear = function(changes) {
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            this.$indexes.clear();
            if (changes) {
              removeChildRefs.call(this, changes);
            }
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports2.OPERATION.CLEAR });
            this.$changes.touchParents();
          };
          CollectionSchema2.prototype.has = function(value) {
            return Array.from(this.$items.values()).some(function(v) {
              return v === value;
            });
          };
          CollectionSchema2.prototype.forEach = function(callbackfn) {
            var _this = this;
            this.$items.forEach(function(value, key, _) {
              return callbackfn(value, key, _this);
            });
          };
          CollectionSchema2.prototype.values = function() {
            return this.$items.values();
          };
          Object.defineProperty(CollectionSchema2.prototype, "size", {
            get: function() {
              return this.$items.size;
            },
            enumerable: false,
            configurable: true
          });
          CollectionSchema2.prototype.setIndex = function(index, key) {
            this.$indexes.set(index, key);
          };
          CollectionSchema2.prototype.getIndex = function(index) {
            return this.$indexes.get(index);
          };
          CollectionSchema2.prototype.getByIndex = function(index) {
            return this.$items.get(this.$indexes.get(index));
          };
          CollectionSchema2.prototype.deleteByIndex = function(index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
          };
          CollectionSchema2.prototype.toArray = function() {
            return Array.from(this.$items.values());
          };
          CollectionSchema2.prototype.toJSON = function() {
            var values = [];
            this.forEach(function(value, key) {
              values.push(typeof value["toJSON"] === "function" ? value["toJSON"]() : value);
            });
            return values;
          };
          CollectionSchema2.prototype.clone = function(isDecoding) {
            var cloned;
            if (isDecoding) {
              cloned = Object.assign(new CollectionSchema2(), this);
            } else {
              cloned = new CollectionSchema2();
              this.forEach(function(value) {
                if (value["$changes"]) {
                  cloned.add(value["clone"]());
                } else {
                  cloned.add(value);
                }
              });
            }
            return cloned;
          };
          return CollectionSchema2;
        }()
      );
      var SetSchema = (
        /** @class */
        function() {
          function SetSchema2(initialValues) {
            var _this = this;
            this.$changes = new ChangeTree(this);
            this.$items = /* @__PURE__ */ new Map();
            this.$indexes = /* @__PURE__ */ new Map();
            this.$refId = 0;
            if (initialValues) {
              initialValues.forEach(function(v) {
                return _this.add(v);
              });
            }
          }
          SetSchema2.prototype.onAdd = function(callback, triggerAll) {
            if (triggerAll === void 0) {
              triggerAll = true;
            }
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.ADD, callback, triggerAll ? this.$items : void 0);
          };
          SetSchema2.prototype.onRemove = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.DELETE, callback);
          };
          SetSchema2.prototype.onChange = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = []), exports2.OPERATION.REPLACE, callback);
          };
          SetSchema2.is = function(type2) {
            return type2["set"] !== void 0;
          };
          SetSchema2.prototype.add = function(value) {
            var _a, _b;
            if (this.has(value)) {
              return false;
            }
            var index = this.$refId++;
            if (value["$changes"] !== void 0) {
              value["$changes"].setParent(this, this.$changes.root, index);
            }
            var operation = (_b = (_a = this.$changes.indexes[index]) === null || _a === void 0 ? void 0 : _a.op) !== null && _b !== void 0 ? _b : exports2.OPERATION.ADD;
            this.$changes.indexes[index] = index;
            this.$indexes.set(index, index);
            this.$items.set(index, value);
            this.$changes.change(index, operation);
            return index;
          };
          SetSchema2.prototype.entries = function() {
            return this.$items.entries();
          };
          SetSchema2.prototype.delete = function(item) {
            var entries = this.$items.entries();
            var index;
            var entry;
            while (entry = entries.next()) {
              if (entry.done) {
                break;
              }
              if (item === entry.value[1]) {
                index = entry.value[0];
                break;
              }
            }
            if (index === void 0) {
              return false;
            }
            this.$changes.delete(index);
            this.$indexes.delete(index);
            return this.$items.delete(index);
          };
          SetSchema2.prototype.clear = function(changes) {
            this.$changes.discard(true, true);
            this.$changes.indexes = {};
            this.$indexes.clear();
            if (changes) {
              removeChildRefs.call(this, changes);
            }
            this.$items.clear();
            this.$changes.operation({ index: 0, op: exports2.OPERATION.CLEAR });
            this.$changes.touchParents();
          };
          SetSchema2.prototype.has = function(value) {
            var values = this.$items.values();
            var has = false;
            var entry;
            while (entry = values.next()) {
              if (entry.done) {
                break;
              }
              if (value === entry.value) {
                has = true;
                break;
              }
            }
            return has;
          };
          SetSchema2.prototype.forEach = function(callbackfn) {
            var _this = this;
            this.$items.forEach(function(value, key, _) {
              return callbackfn(value, key, _this);
            });
          };
          SetSchema2.prototype.values = function() {
            return this.$items.values();
          };
          Object.defineProperty(SetSchema2.prototype, "size", {
            get: function() {
              return this.$items.size;
            },
            enumerable: false,
            configurable: true
          });
          SetSchema2.prototype.setIndex = function(index, key) {
            this.$indexes.set(index, key);
          };
          SetSchema2.prototype.getIndex = function(index) {
            return this.$indexes.get(index);
          };
          SetSchema2.prototype.getByIndex = function(index) {
            return this.$items.get(this.$indexes.get(index));
          };
          SetSchema2.prototype.deleteByIndex = function(index) {
            var key = this.$indexes.get(index);
            this.$items.delete(key);
            this.$indexes.delete(index);
          };
          SetSchema2.prototype.toArray = function() {
            return Array.from(this.$items.values());
          };
          SetSchema2.prototype.toJSON = function() {
            var values = [];
            this.forEach(function(value, key) {
              values.push(typeof value["toJSON"] === "function" ? value["toJSON"]() : value);
            });
            return values;
          };
          SetSchema2.prototype.clone = function(isDecoding) {
            var cloned;
            if (isDecoding) {
              cloned = Object.assign(new SetSchema2(), this);
            } else {
              cloned = new SetSchema2();
              this.forEach(function(value) {
                if (value["$changes"]) {
                  cloned.add(value["clone"]());
                } else {
                  cloned.add(value);
                }
              });
            }
            return cloned;
          };
          return SetSchema2;
        }()
      );
      var ClientState = (
        /** @class */
        function() {
          function ClientState2() {
            this.refIds = /* @__PURE__ */ new WeakSet();
            this.containerIndexes = /* @__PURE__ */ new WeakMap();
          }
          ClientState2.prototype.addRefId = function(changeTree) {
            if (!this.refIds.has(changeTree)) {
              this.refIds.add(changeTree);
              this.containerIndexes.set(changeTree, /* @__PURE__ */ new Set());
            }
          };
          ClientState2.get = function(client) {
            if (client.$filterState === void 0) {
              client.$filterState = new ClientState2();
            }
            return client.$filterState;
          };
          return ClientState2;
        }()
      );
      var ReferenceTracker = (
        /** @class */
        function() {
          function ReferenceTracker2() {
            this.refs = /* @__PURE__ */ new Map();
            this.refCounts = {};
            this.deletedRefs = /* @__PURE__ */ new Set();
            this.nextUniqueId = 0;
          }
          ReferenceTracker2.prototype.getNextUniqueId = function() {
            return this.nextUniqueId++;
          };
          ReferenceTracker2.prototype.addRef = function(refId, ref, incrementCount) {
            if (incrementCount === void 0) {
              incrementCount = true;
            }
            this.refs.set(refId, ref);
            if (incrementCount) {
              this.refCounts[refId] = (this.refCounts[refId] || 0) + 1;
            }
          };
          ReferenceTracker2.prototype.removeRef = function(refId) {
            var refCount = this.refCounts[refId];
            if (refCount === void 0) {
              console.warn("trying to remove reference ".concat(refId, " that doesn't exist"));
              return;
            }
            if (refCount === 0) {
              console.warn("trying to remove reference ".concat(refId, " with 0 refCount"));
              return;
            }
            this.refCounts[refId] = refCount - 1;
            this.deletedRefs.add(refId);
          };
          ReferenceTracker2.prototype.clearRefs = function() {
            this.refs.clear();
            this.deletedRefs.clear();
            this.refCounts = {};
          };
          ReferenceTracker2.prototype.garbageCollectDeletedRefs = function() {
            var _this = this;
            this.deletedRefs.forEach(function(refId) {
              if (_this.refCounts[refId] > 0) {
                return;
              }
              var ref = _this.refs.get(refId);
              if (ref instanceof Schema) {
                for (var fieldName in ref["_definition"].schema) {
                  if (typeof ref["_definition"].schema[fieldName] !== "string" && ref[fieldName] && ref[fieldName]["$changes"]) {
                    _this.removeRef(ref[fieldName]["$changes"].refId);
                  }
                }
              } else {
                var definition = ref["$changes"].parent._definition;
                var type2 = definition.schema[definition.fieldsByIndex[ref["$changes"].parentIndex]];
                if (typeof Object.values(type2)[0] === "function") {
                  Array.from(ref.values()).forEach(function(child) {
                    return _this.removeRef(child["$changes"].refId);
                  });
                }
              }
              _this.refs.delete(refId);
              delete _this.refCounts[refId];
            });
            this.deletedRefs.clear();
          };
          return ReferenceTracker2;
        }()
      );
      var EncodeSchemaError = (
        /** @class */
        function(_super) {
          __extends(EncodeSchemaError2, _super);
          function EncodeSchemaError2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          return EncodeSchemaError2;
        }(Error)
      );
      function assertType(value, type2, klass, field) {
        var typeofTarget;
        var allowNull = false;
        switch (type2) {
          case "number":
          case "int8":
          case "uint8":
          case "int16":
          case "uint16":
          case "int32":
          case "uint32":
          case "int64":
          case "uint64":
          case "float32":
          case "float64":
            typeofTarget = "number";
            if (isNaN(value)) {
              console.log('trying to encode "NaN" in '.concat(klass.constructor.name, "#").concat(field));
            }
            break;
          case "string":
            typeofTarget = "string";
            allowNull = true;
            break;
          case "boolean":
            return;
        }
        if (typeof value !== typeofTarget && (!allowNull || allowNull && value !== null)) {
          var foundValue = "'".concat(JSON.stringify(value), "'").concat(value && value.constructor && " (".concat(value.constructor.name, ")") || "");
          throw new EncodeSchemaError("a '".concat(typeofTarget, "' was expected, but ").concat(foundValue, " was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
      }
      function assertInstanceType(value, type2, klass, field) {
        if (!(value instanceof type2)) {
          throw new EncodeSchemaError("a '".concat(type2.name, "' was expected, but '").concat(value.constructor.name, "' was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
      }
      function encodePrimitiveType(type2, bytes, value, klass, field) {
        assertType(value, type2, klass, field);
        var encodeFunc = encode[type2];
        if (encodeFunc) {
          encodeFunc(bytes, value);
        } else {
          throw new EncodeSchemaError("a '".concat(type2, "' was expected, but ").concat(value, " was provided in ").concat(klass.constructor.name, "#").concat(field));
        }
      }
      function decodePrimitiveType(type2, bytes, it) {
        return decode2[type2](bytes, it);
      }
      var Schema = (
        /** @class */
        function() {
          function Schema2() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            Object.defineProperties(this, {
              $changes: {
                value: new ChangeTree(this, void 0, new ReferenceTracker()),
                enumerable: false,
                writable: true
              },
              // $listeners: {
              //     value: undefined,
              //     enumerable: false,
              //     writable: true
              // },
              $callbacks: {
                value: void 0,
                enumerable: false,
                writable: true
              }
            });
            var descriptors = this._definition.descriptors;
            if (descriptors) {
              Object.defineProperties(this, descriptors);
            }
            if (args[0]) {
              this.assign(args[0]);
            }
          }
          Schema2.onError = function(e) {
            console.error(e);
          };
          Schema2.is = function(type2) {
            return type2["_definition"] && type2["_definition"].schema !== void 0;
          };
          Schema2.prototype.onChange = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.REPLACE, callback);
          };
          Schema2.prototype.onRemove = function(callback) {
            return addCallback(this.$callbacks || (this.$callbacks = {}), exports2.OPERATION.DELETE, callback);
          };
          Schema2.prototype.assign = function(props) {
            Object.assign(this, props);
            return this;
          };
          Object.defineProperty(Schema2.prototype, "_definition", {
            get: function() {
              return this.constructor._definition;
            },
            enumerable: false,
            configurable: true
          });
          Schema2.prototype.setDirty = function(property2, operation) {
            this.$changes.change(property2, operation);
          };
          Schema2.prototype.listen = function(prop, callback, immediate) {
            var _this = this;
            if (immediate === void 0) {
              immediate = true;
            }
            if (!this.$callbacks) {
              this.$callbacks = {};
            }
            if (!this.$callbacks[prop]) {
              this.$callbacks[prop] = [];
            }
            this.$callbacks[prop].push(callback);
            if (immediate && this[prop] !== void 0) {
              callback(this[prop], void 0);
            }
            return function() {
              return spliceOne(_this.$callbacks[prop], _this.$callbacks[prop].indexOf(callback));
            };
          };
          Schema2.prototype.decode = function(bytes, it, ref) {
            if (it === void 0) {
              it = { offset: 0 };
            }
            if (ref === void 0) {
              ref = this;
            }
            var allChanges = [];
            var $root = this.$changes.root;
            var totalBytes = bytes.length;
            var refId = 0;
            $root.refs.set(refId, this);
            while (it.offset < totalBytes) {
              var byte = bytes[it.offset++];
              if (byte == SWITCH_TO_STRUCTURE) {
                refId = number(bytes, it);
                var nextRef = $root.refs.get(refId);
                if (!nextRef) {
                  throw new Error('"refId" not found: '.concat(refId));
                }
                ref = nextRef;
                continue;
              }
              var changeTree = ref["$changes"];
              var isSchema = ref["_definition"] !== void 0;
              var operation = isSchema ? byte >> 6 << 6 : byte;
              if (operation === exports2.OPERATION.CLEAR) {
                ref.clear(allChanges);
                continue;
              }
              var fieldIndex = isSchema ? byte % (operation || 255) : number(bytes, it);
              var fieldName = isSchema ? ref["_definition"].fieldsByIndex[fieldIndex] : "";
              var type2 = changeTree.getType(fieldIndex);
              var value = void 0;
              var previousValue = void 0;
              var dynamicIndex = void 0;
              if (!isSchema) {
                previousValue = ref["getByIndex"](fieldIndex);
                if ((operation & exports2.OPERATION.ADD) === exports2.OPERATION.ADD) {
                  dynamicIndex = ref instanceof MapSchema ? string(bytes, it) : fieldIndex;
                  ref["setIndex"](fieldIndex, dynamicIndex);
                } else {
                  dynamicIndex = ref["getIndex"](fieldIndex);
                }
              } else {
                previousValue = ref["_".concat(fieldName)];
              }
              if ((operation & exports2.OPERATION.DELETE) === exports2.OPERATION.DELETE) {
                if (operation !== exports2.OPERATION.DELETE_AND_ADD) {
                  ref["deleteByIndex"](fieldIndex);
                }
                if (previousValue && previousValue["$changes"]) {
                  $root.removeRef(previousValue["$changes"].refId);
                }
                value = null;
              }
              if (fieldName === void 0) {
                console.warn("@colyseus/schema: definition mismatch");
                var nextIterator = { offset: it.offset };
                while (it.offset < totalBytes) {
                  if (switchStructureCheck(bytes, it)) {
                    nextIterator.offset = it.offset + 1;
                    if ($root.refs.has(number(bytes, nextIterator))) {
                      break;
                    }
                  }
                  it.offset++;
                }
                continue;
              } else if (operation === exports2.OPERATION.DELETE)
                ;
              else if (Schema2.is(type2)) {
                var refId_1 = number(bytes, it);
                value = $root.refs.get(refId_1);
                if (operation !== exports2.OPERATION.REPLACE) {
                  var childType = this.getSchemaType(bytes, it, type2);
                  if (!value) {
                    value = this.createTypeInstance(childType);
                    value.$changes.refId = refId_1;
                    if (previousValue) {
                      value.$callbacks = previousValue.$callbacks;
                      if (previousValue["$changes"].refId && refId_1 !== previousValue["$changes"].refId) {
                        $root.removeRef(previousValue["$changes"].refId);
                      }
                    }
                  }
                  $root.addRef(refId_1, value, value !== previousValue);
                }
              } else if (typeof type2 === "string") {
                value = decodePrimitiveType(type2, bytes, it);
              } else {
                var typeDef = getType(Object.keys(type2)[0]);
                var refId_2 = number(bytes, it);
                var valueRef = $root.refs.has(refId_2) ? previousValue || $root.refs.get(refId_2) : new typeDef.constructor();
                value = valueRef.clone(true);
                value.$changes.refId = refId_2;
                if (previousValue) {
                  value["$callbacks"] = previousValue["$callbacks"];
                  if (previousValue["$changes"].refId && refId_2 !== previousValue["$changes"].refId) {
                    $root.removeRef(previousValue["$changes"].refId);
                    var entries = previousValue.entries();
                    var iter = void 0;
                    while ((iter = entries.next()) && !iter.done) {
                      var _a = iter.value, key = _a[0], value_1 = _a[1];
                      allChanges.push({
                        refId: refId_2,
                        op: exports2.OPERATION.DELETE,
                        field: key,
                        value: void 0,
                        previousValue: value_1
                      });
                    }
                  }
                }
                $root.addRef(refId_2, value, valueRef !== previousValue);
              }
              if (value !== null && value !== void 0) {
                if (value["$changes"]) {
                  value["$changes"].setParent(changeTree.ref, changeTree.root, fieldIndex);
                }
                if (ref instanceof Schema2) {
                  ref[fieldName] = value;
                } else if (ref instanceof MapSchema) {
                  var key = dynamicIndex;
                  ref["$items"].set(key, value);
                  ref["$changes"].allChanges.add(fieldIndex);
                } else if (ref instanceof ArraySchema) {
                  ref.setAt(fieldIndex, value);
                } else if (ref instanceof CollectionSchema) {
                  var index = ref.add(value);
                  ref["setIndex"](fieldIndex, index);
                } else if (ref instanceof SetSchema) {
                  var index = ref.add(value);
                  if (index !== false) {
                    ref["setIndex"](fieldIndex, index);
                  }
                }
              }
              if (previousValue !== value) {
                allChanges.push({
                  refId,
                  op: operation,
                  field: fieldName,
                  dynamicIndex,
                  value,
                  previousValue
                });
              }
            }
            this._triggerChanges(allChanges);
            $root.garbageCollectDeletedRefs();
            return allChanges;
          };
          Schema2.prototype.encode = function(encodeAll, bytes, useFilters) {
            if (encodeAll === void 0) {
              encodeAll = false;
            }
            if (bytes === void 0) {
              bytes = [];
            }
            if (useFilters === void 0) {
              useFilters = false;
            }
            var rootChangeTree = this.$changes;
            var refIdsVisited = /* @__PURE__ */ new WeakSet();
            var changeTrees = [rootChangeTree];
            var numChangeTrees = 1;
            for (var i = 0; i < numChangeTrees; i++) {
              var changeTree = changeTrees[i];
              var ref = changeTree.ref;
              var isSchema = ref instanceof Schema2;
              changeTree.ensureRefId();
              refIdsVisited.add(changeTree);
              if (changeTree !== rootChangeTree && (changeTree.changed || encodeAll)) {
                uint8$1(bytes, SWITCH_TO_STRUCTURE);
                number$1(bytes, changeTree.refId);
              }
              var changes = encodeAll ? Array.from(changeTree.allChanges) : Array.from(changeTree.changes.values());
              for (var j = 0, cl = changes.length; j < cl; j++) {
                var operation = encodeAll ? { op: exports2.OPERATION.ADD, index: changes[j] } : changes[j];
                var fieldIndex = operation.index;
                var field = isSchema ? ref["_definition"].fieldsByIndex && ref["_definition"].fieldsByIndex[fieldIndex] : fieldIndex;
                var beginIndex = bytes.length;
                if (operation.op !== exports2.OPERATION.TOUCH) {
                  if (isSchema) {
                    uint8$1(bytes, fieldIndex | operation.op);
                  } else {
                    uint8$1(bytes, operation.op);
                    if (operation.op === exports2.OPERATION.CLEAR) {
                      continue;
                    }
                    number$1(bytes, fieldIndex);
                  }
                }
                if (!isSchema && (operation.op & exports2.OPERATION.ADD) == exports2.OPERATION.ADD) {
                  if (ref instanceof MapSchema) {
                    var dynamicIndex = changeTree.ref["$indexes"].get(fieldIndex);
                    string$1(bytes, dynamicIndex);
                  }
                }
                if (operation.op === exports2.OPERATION.DELETE) {
                  continue;
                }
                var type2 = changeTree.getType(fieldIndex);
                var value = changeTree.getValue(fieldIndex);
                if (value && value["$changes"] && !refIdsVisited.has(value["$changes"])) {
                  changeTrees.push(value["$changes"]);
                  value["$changes"].ensureRefId();
                  numChangeTrees++;
                }
                if (operation.op === exports2.OPERATION.TOUCH) {
                  continue;
                }
                if (Schema2.is(type2)) {
                  assertInstanceType(value, type2, ref, field);
                  number$1(bytes, value.$changes.refId);
                  if ((operation.op & exports2.OPERATION.ADD) === exports2.OPERATION.ADD) {
                    this.tryEncodeTypeId(bytes, type2, value.constructor);
                  }
                } else if (typeof type2 === "string") {
                  encodePrimitiveType(type2, bytes, value, ref, field);
                } else {
                  var definition = getType(Object.keys(type2)[0]);
                  assertInstanceType(ref["_".concat(field)], definition.constructor, ref, field);
                  number$1(bytes, value.$changes.refId);
                }
                if (useFilters) {
                  changeTree.cache(fieldIndex, bytes.slice(beginIndex));
                }
              }
              if (!encodeAll && !useFilters) {
                changeTree.discard();
              }
            }
            return bytes;
          };
          Schema2.prototype.encodeAll = function(useFilters) {
            return this.encode(true, [], useFilters);
          };
          Schema2.prototype.applyFilters = function(client, encodeAll) {
            var _a, _b;
            if (encodeAll === void 0) {
              encodeAll = false;
            }
            var root = this;
            var refIdsDissallowed = /* @__PURE__ */ new Set();
            var $filterState = ClientState.get(client);
            var changeTrees = [this.$changes];
            var numChangeTrees = 1;
            var filteredBytes = [];
            var _loop_1 = function(i2) {
              var changeTree = changeTrees[i2];
              if (refIdsDissallowed.has(changeTree.refId)) {
                return "continue";
              }
              var ref = changeTree.ref;
              var isSchema = ref instanceof Schema2;
              uint8$1(filteredBytes, SWITCH_TO_STRUCTURE);
              number$1(filteredBytes, changeTree.refId);
              var clientHasRefId = $filterState.refIds.has(changeTree);
              var isEncodeAll = encodeAll || !clientHasRefId;
              $filterState.addRefId(changeTree);
              var containerIndexes = $filterState.containerIndexes.get(changeTree);
              var changes = isEncodeAll ? Array.from(changeTree.allChanges) : Array.from(changeTree.changes.values());
              if (!encodeAll && isSchema && ref._definition.indexesWithFilters) {
                var indexesWithFilters = ref._definition.indexesWithFilters;
                indexesWithFilters.forEach(function(indexWithFilter) {
                  if (!containerIndexes.has(indexWithFilter) && changeTree.allChanges.has(indexWithFilter)) {
                    if (isEncodeAll) {
                      changes.push(indexWithFilter);
                    } else {
                      changes.push({ op: exports2.OPERATION.ADD, index: indexWithFilter });
                    }
                  }
                });
              }
              for (var j = 0, cl = changes.length; j < cl; j++) {
                var change = isEncodeAll ? { op: exports2.OPERATION.ADD, index: changes[j] } : changes[j];
                if (change.op === exports2.OPERATION.CLEAR) {
                  uint8$1(filteredBytes, change.op);
                  continue;
                }
                var fieldIndex = change.index;
                if (change.op === exports2.OPERATION.DELETE) {
                  if (isSchema) {
                    uint8$1(filteredBytes, change.op | fieldIndex);
                  } else {
                    uint8$1(filteredBytes, change.op);
                    number$1(filteredBytes, fieldIndex);
                  }
                  continue;
                }
                var value = changeTree.getValue(fieldIndex);
                var type2 = changeTree.getType(fieldIndex);
                if (isSchema) {
                  var filter2 = ref._definition.filters && ref._definition.filters[fieldIndex];
                  if (filter2 && !filter2.call(ref, client, value, root)) {
                    if (value && value["$changes"]) {
                      refIdsDissallowed.add(value["$changes"].refId);
                    }
                    continue;
                  }
                } else {
                  var parent = changeTree.parent;
                  var filter2 = changeTree.getChildrenFilter();
                  if (filter2 && !filter2.call(parent, client, ref["$indexes"].get(fieldIndex), value, root)) {
                    if (value && value["$changes"]) {
                      refIdsDissallowed.add(value["$changes"].refId);
                    }
                    continue;
                  }
                }
                if (value["$changes"]) {
                  changeTrees.push(value["$changes"]);
                  numChangeTrees++;
                }
                if (change.op !== exports2.OPERATION.TOUCH) {
                  if (change.op === exports2.OPERATION.ADD || isSchema) {
                    filteredBytes.push.apply(filteredBytes, (_a = changeTree.caches[fieldIndex]) !== null && _a !== void 0 ? _a : []);
                    containerIndexes.add(fieldIndex);
                  } else {
                    if (containerIndexes.has(fieldIndex)) {
                      filteredBytes.push.apply(filteredBytes, (_b = changeTree.caches[fieldIndex]) !== null && _b !== void 0 ? _b : []);
                    } else {
                      containerIndexes.add(fieldIndex);
                      uint8$1(filteredBytes, exports2.OPERATION.ADD);
                      number$1(filteredBytes, fieldIndex);
                      if (ref instanceof MapSchema) {
                        var dynamicIndex = changeTree.ref["$indexes"].get(fieldIndex);
                        string$1(filteredBytes, dynamicIndex);
                      }
                      if (value["$changes"]) {
                        number$1(filteredBytes, value["$changes"].refId);
                      } else {
                        encode[type2](filteredBytes, value);
                      }
                    }
                  }
                } else if (value["$changes"] && !isSchema) {
                  uint8$1(filteredBytes, exports2.OPERATION.ADD);
                  number$1(filteredBytes, fieldIndex);
                  if (ref instanceof MapSchema) {
                    var dynamicIndex = changeTree.ref["$indexes"].get(fieldIndex);
                    string$1(filteredBytes, dynamicIndex);
                  }
                  number$1(filteredBytes, value["$changes"].refId);
                }
              }
            };
            for (var i = 0; i < numChangeTrees; i++) {
              _loop_1(i);
            }
            return filteredBytes;
          };
          Schema2.prototype.clone = function() {
            var _a;
            var cloned = new this.constructor();
            var schema = this._definition.schema;
            for (var field in schema) {
              if (typeof this[field] === "object" && typeof ((_a = this[field]) === null || _a === void 0 ? void 0 : _a.clone) === "function") {
                cloned[field] = this[field].clone();
              } else {
                cloned[field] = this[field];
              }
            }
            return cloned;
          };
          Schema2.prototype.toJSON = function() {
            var schema = this._definition.schema;
            var deprecated2 = this._definition.deprecated;
            var obj = {};
            for (var field in schema) {
              if (!deprecated2[field] && this[field] !== null && typeof this[field] !== "undefined") {
                obj[field] = typeof this[field]["toJSON"] === "function" ? this[field]["toJSON"]() : this["_".concat(field)];
              }
            }
            return obj;
          };
          Schema2.prototype.discardAllChanges = function() {
            this.$changes.discardAll();
          };
          Schema2.prototype.getByIndex = function(index) {
            return this[this._definition.fieldsByIndex[index]];
          };
          Schema2.prototype.deleteByIndex = function(index) {
            this[this._definition.fieldsByIndex[index]] = void 0;
          };
          Schema2.prototype.tryEncodeTypeId = function(bytes, type2, targetType) {
            if (type2._typeid !== targetType._typeid) {
              uint8$1(bytes, TYPE_ID);
              number$1(bytes, targetType._typeid);
            }
          };
          Schema2.prototype.getSchemaType = function(bytes, it, defaultType) {
            var type2;
            if (bytes[it.offset] === TYPE_ID) {
              it.offset++;
              type2 = this.constructor._context.get(number(bytes, it));
            }
            return type2 || defaultType;
          };
          Schema2.prototype.createTypeInstance = function(type2) {
            var instance = new type2();
            instance.$changes.root = this.$changes.root;
            return instance;
          };
          Schema2.prototype._triggerChanges = function(changes) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var uniqueRefIds = /* @__PURE__ */ new Set();
            var $refs = this.$changes.root.refs;
            var _loop_2 = function(i2) {
              var change = changes[i2];
              var refId = change.refId;
              var ref = $refs.get(refId);
              var $callbacks = ref["$callbacks"];
              if ((change.op & exports2.OPERATION.DELETE) === exports2.OPERATION.DELETE && change.previousValue instanceof Schema2) {
                (_b = (_a = change.previousValue["$callbacks"]) === null || _a === void 0 ? void 0 : _a[exports2.OPERATION.DELETE]) === null || _b === void 0 ? void 0 : _b.forEach(function(callback) {
                  return callback();
                });
              }
              if (!$callbacks) {
                return "continue";
              }
              if (ref instanceof Schema2) {
                if (!uniqueRefIds.has(refId)) {
                  try {
                    (_c = $callbacks === null || $callbacks === void 0 ? void 0 : $callbacks[exports2.OPERATION.REPLACE]) === null || _c === void 0 ? void 0 : _c.forEach(function(callback) {
                      return callback();
                    });
                  } catch (e) {
                    Schema2.onError(e);
                  }
                }
                try {
                  if ($callbacks.hasOwnProperty(change.field)) {
                    (_d = $callbacks[change.field]) === null || _d === void 0 ? void 0 : _d.forEach(function(callback) {
                      return callback(change.value, change.previousValue);
                    });
                  }
                } catch (e) {
                  Schema2.onError(e);
                }
              } else {
                if (change.op === exports2.OPERATION.ADD && change.previousValue === void 0) {
                  (_e = $callbacks[exports2.OPERATION.ADD]) === null || _e === void 0 ? void 0 : _e.forEach(function(callback) {
                    var _a2;
                    return callback(change.value, (_a2 = change.dynamicIndex) !== null && _a2 !== void 0 ? _a2 : change.field);
                  });
                } else if (change.op === exports2.OPERATION.DELETE) {
                  if (change.previousValue !== void 0) {
                    (_f = $callbacks[exports2.OPERATION.DELETE]) === null || _f === void 0 ? void 0 : _f.forEach(function(callback) {
                      var _a2;
                      return callback(change.previousValue, (_a2 = change.dynamicIndex) !== null && _a2 !== void 0 ? _a2 : change.field);
                    });
                  }
                } else if (change.op === exports2.OPERATION.DELETE_AND_ADD) {
                  if (change.previousValue !== void 0) {
                    (_g = $callbacks[exports2.OPERATION.DELETE]) === null || _g === void 0 ? void 0 : _g.forEach(function(callback) {
                      var _a2;
                      return callback(change.previousValue, (_a2 = change.dynamicIndex) !== null && _a2 !== void 0 ? _a2 : change.field);
                    });
                  }
                  (_h = $callbacks[exports2.OPERATION.ADD]) === null || _h === void 0 ? void 0 : _h.forEach(function(callback) {
                    var _a2;
                    return callback(change.value, (_a2 = change.dynamicIndex) !== null && _a2 !== void 0 ? _a2 : change.field);
                  });
                }
                if (change.value !== change.previousValue) {
                  (_j = $callbacks[exports2.OPERATION.REPLACE]) === null || _j === void 0 ? void 0 : _j.forEach(function(callback) {
                    var _a2;
                    return callback(change.value, (_a2 = change.dynamicIndex) !== null && _a2 !== void 0 ? _a2 : change.field);
                  });
                }
              }
              uniqueRefIds.add(refId);
            };
            for (var i = 0; i < changes.length; i++) {
              _loop_2(i);
            }
          };
          Schema2._definition = SchemaDefinition.create();
          return Schema2;
        }()
      );
      function dumpChanges(schema) {
        var changeTrees = [schema["$changes"]];
        var numChangeTrees = 1;
        var dump = {};
        var currentStructure = dump;
        var _loop_1 = function(i2) {
          var changeTree = changeTrees[i2];
          changeTree.changes.forEach(function(change) {
            var ref = changeTree.ref;
            var fieldIndex = change.index;
            var field = ref["_definition"] ? ref["_definition"].fieldsByIndex[fieldIndex] : ref["$indexes"].get(fieldIndex);
            currentStructure[field] = changeTree.getValue(fieldIndex);
          });
        };
        for (var i = 0; i < numChangeTrees; i++) {
          _loop_1(i);
        }
        return dump;
      }
      var reflectionContext = { context: new Context() };
      var ReflectionField = (
        /** @class */
        function(_super) {
          __extends(ReflectionField2, _super);
          function ReflectionField2() {
            return _super !== null && _super.apply(this, arguments) || this;
          }
          __decorate13([
            type("string", reflectionContext)
          ], ReflectionField2.prototype, "name", void 0);
          __decorate13([
            type("string", reflectionContext)
          ], ReflectionField2.prototype, "type", void 0);
          __decorate13([
            type("number", reflectionContext)
          ], ReflectionField2.prototype, "referencedType", void 0);
          return ReflectionField2;
        }(Schema)
      );
      var ReflectionType = (
        /** @class */
        function(_super) {
          __extends(ReflectionType2, _super);
          function ReflectionType2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fields = new ArraySchema();
            return _this;
          }
          __decorate13([
            type("number", reflectionContext)
          ], ReflectionType2.prototype, "id", void 0);
          __decorate13([
            type([ReflectionField], reflectionContext)
          ], ReflectionType2.prototype, "fields", void 0);
          return ReflectionType2;
        }(Schema)
      );
      var Reflection = (
        /** @class */
        function(_super) {
          __extends(Reflection2, _super);
          function Reflection2() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.types = new ArraySchema();
            return _this;
          }
          Reflection2.encode = function(instance) {
            var _a;
            var rootSchemaType = instance.constructor;
            var reflection = new Reflection2();
            reflection.rootType = rootSchemaType._typeid;
            var buildType = function(currentType, schema) {
              for (var fieldName in schema) {
                var field = new ReflectionField();
                field.name = fieldName;
                var fieldType = void 0;
                if (typeof schema[fieldName] === "string") {
                  fieldType = schema[fieldName];
                } else {
                  var type_1 = schema[fieldName];
                  var childTypeSchema = void 0;
                  if (Schema.is(type_1)) {
                    fieldType = "ref";
                    childTypeSchema = schema[fieldName];
                  } else {
                    fieldType = Object.keys(type_1)[0];
                    if (typeof type_1[fieldType] === "string") {
                      fieldType += ":" + type_1[fieldType];
                    } else {
                      childTypeSchema = type_1[fieldType];
                    }
                  }
                  field.referencedType = childTypeSchema ? childTypeSchema._typeid : -1;
                }
                field.type = fieldType;
                currentType.fields.push(field);
              }
              reflection.types.push(currentType);
            };
            var types = (_a = rootSchemaType._context) === null || _a === void 0 ? void 0 : _a.types;
            for (var typeid in types) {
              var type_2 = new ReflectionType();
              type_2.id = Number(typeid);
              buildType(type_2, types[typeid]._definition.schema);
            }
            return reflection.encodeAll();
          };
          Reflection2.decode = function(bytes, it) {
            var context = new Context();
            var reflection = new Reflection2();
            reflection.decode(bytes, it);
            var schemaTypes = reflection.types.reduce(function(types, reflectionType) {
              var schema = (
                /** @class */
                function(_super2) {
                  __extends(_, _super2);
                  function _() {
                    return _super2 !== null && _super2.apply(this, arguments) || this;
                  }
                  return _;
                }(Schema)
              );
              var typeid = reflectionType.id;
              types[typeid] = schema;
              context.add(schema, typeid);
              return types;
            }, {});
            reflection.types.forEach(function(reflectionType) {
              var schemaType = schemaTypes[reflectionType.id];
              reflectionType.fields.forEach(function(field) {
                var _a;
                if (field.referencedType !== void 0) {
                  var fieldType2 = field.type;
                  var refType = schemaTypes[field.referencedType];
                  if (!refType) {
                    var typeInfo = field.type.split(":");
                    fieldType2 = typeInfo[0];
                    refType = typeInfo[1];
                  }
                  if (fieldType2 === "ref") {
                    type(refType, { context })(schemaType.prototype, field.name);
                  } else {
                    type((_a = {}, _a[fieldType2] = refType, _a), { context })(schemaType.prototype, field.name);
                  }
                } else {
                  type(field.type, { context })(schemaType.prototype, field.name);
                }
              });
            });
            var rootType = schemaTypes[reflection.rootType];
            var rootInstance = new rootType();
            for (var fieldName in rootType._definition.schema) {
              var fieldType = rootType._definition.schema[fieldName];
              if (typeof fieldType !== "string") {
                rootInstance[fieldName] = typeof fieldType === "function" ? new fieldType() : new (getType(Object.keys(fieldType)[0])).constructor();
              }
            }
            return rootInstance;
          };
          __decorate13([
            type([ReflectionType], reflectionContext)
          ], Reflection2.prototype, "types", void 0);
          __decorate13([
            type("number", reflectionContext)
          ], Reflection2.prototype, "rootType", void 0);
          return Reflection2;
        }(Schema)
      );
      registerType("map", { constructor: MapSchema });
      registerType("array", { constructor: ArraySchema });
      registerType("set", { constructor: SetSchema });
      registerType("collection", { constructor: CollectionSchema });
      exports2.ArraySchema = ArraySchema;
      exports2.CollectionSchema = CollectionSchema;
      exports2.Context = Context;
      exports2.MapSchema = MapSchema;
      exports2.Reflection = Reflection;
      exports2.ReflectionField = ReflectionField;
      exports2.ReflectionType = ReflectionType;
      exports2.Schema = Schema;
      exports2.SchemaDefinition = SchemaDefinition;
      exports2.SetSchema = SetSchema;
      exports2.decode = decode2;
      exports2.defineTypes = defineTypes;
      exports2.deprecated = deprecated;
      exports2.dumpChanges = dumpChanges;
      exports2.encode = encode;
      exports2.filter = filter;
      exports2.filterChildren = filterChildren;
      exports2.hasFilter = hasFilter;
      exports2.registerType = registerType;
      exports2.type = type;
    });
  }
});

// node_modules/colyseus.js/lib/Room.js
var require_Room = __commonJS({
  "node_modules/colyseus.js/lib/Room.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Room = void 0;
    var msgpack = __importStar(require_msgpack());
    var Connection_1 = require_Connection();
    var Protocol_1 = require_Protocol();
    var Serializer_1 = require_Serializer();
    var nanoevents_1 = require_nanoevents();
    var signal_1 = require_signal();
    var schema_1 = require_umd();
    var ServerError_1 = require_ServerError();
    var Room = class {
      constructor(name, rootSchema) {
        this.onStateChange = (0, signal_1.createSignal)();
        this.onError = (0, signal_1.createSignal)();
        this.onLeave = (0, signal_1.createSignal)();
        this.onJoin = (0, signal_1.createSignal)();
        this.hasJoined = false;
        this.onMessageHandlers = (0, nanoevents_1.createNanoEvents)();
        this.roomId = null;
        this.name = name;
        if (rootSchema) {
          this.serializer = new ((0, Serializer_1.getSerializer)("schema"))();
          this.rootSchema = rootSchema;
          this.serializer.state = new rootSchema();
        }
        this.onError((code, message) => {
          var _a;
          return (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js - onError => (${code}) ${message}`);
        });
        this.onLeave(() => this.removeAllListeners());
      }
      // TODO: deprecate me on version 1.0
      get id() {
        return this.roomId;
      }
      connect(endpoint, devModeCloseCallback, room = this) {
        const connection = new Connection_1.Connection();
        room.connection = connection;
        connection.events.onmessage = Room.prototype.onMessageCallback.bind(room);
        connection.events.onclose = function(e) {
          var _a;
          if (!room.hasJoined) {
            (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room connection was closed unexpectedly (${e.code}): ${e.reason}`);
            room.onError.invoke(e.code, e.reason);
            return;
          }
          if (e.code === ServerError_1.CloseCode.DEVMODE_RESTART && devModeCloseCallback) {
            devModeCloseCallback();
          } else {
            room.onLeave.invoke(e.code);
            room.destroy();
          }
        };
        connection.events.onerror = function(e) {
          var _a;
          (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `Room, onError (${e.code}): ${e.reason}`);
          room.onError.invoke(e.code, e.reason);
        };
        connection.connect(endpoint);
      }
      leave(consented = true) {
        return new Promise((resolve) => {
          this.onLeave((code) => resolve(code));
          if (this.connection) {
            if (consented) {
              this.connection.send([Protocol_1.Protocol.LEAVE_ROOM]);
            } else {
              this.connection.close();
            }
          } else {
            this.onLeave.invoke(ServerError_1.CloseCode.CONSENTED);
          }
        });
      }
      onMessage(type, callback) {
        return this.onMessageHandlers.on(this.getMessageHandlerKey(type), callback);
      }
      send(type, message) {
        const initialBytes = [Protocol_1.Protocol.ROOM_DATA];
        if (typeof type === "string") {
          schema_1.encode.string(initialBytes, type);
        } else {
          schema_1.encode.number(initialBytes, type);
        }
        let arr;
        if (message !== void 0) {
          const encoded = msgpack.encode(message);
          arr = new Uint8Array(initialBytes.length + encoded.byteLength);
          arr.set(new Uint8Array(initialBytes), 0);
          arr.set(new Uint8Array(encoded), initialBytes.length);
        } else {
          arr = new Uint8Array(initialBytes);
        }
        this.connection.send(arr.buffer);
      }
      sendBytes(type, bytes) {
        const initialBytes = [Protocol_1.Protocol.ROOM_DATA_BYTES];
        if (typeof type === "string") {
          schema_1.encode.string(initialBytes, type);
        } else {
          schema_1.encode.number(initialBytes, type);
        }
        let arr;
        arr = new Uint8Array(initialBytes.length + (bytes.byteLength || bytes.length));
        arr.set(new Uint8Array(initialBytes), 0);
        arr.set(new Uint8Array(bytes), initialBytes.length);
        this.connection.send(arr.buffer);
      }
      get state() {
        return this.serializer.getState();
      }
      removeAllListeners() {
        this.onJoin.clear();
        this.onStateChange.clear();
        this.onError.clear();
        this.onLeave.clear();
        this.onMessageHandlers.events = {};
      }
      onMessageCallback(event) {
        const bytes = Array.from(new Uint8Array(event.data));
        const code = bytes[0];
        if (code === Protocol_1.Protocol.JOIN_ROOM) {
          let offset2 = 1;
          const reconnectionToken = (0, Protocol_1.utf8Read)(bytes, offset2);
          offset2 += (0, Protocol_1.utf8Length)(reconnectionToken);
          this.serializerId = (0, Protocol_1.utf8Read)(bytes, offset2);
          offset2 += (0, Protocol_1.utf8Length)(this.serializerId);
          if (!this.serializer) {
            const serializer = (0, Serializer_1.getSerializer)(this.serializerId);
            this.serializer = new serializer();
          }
          if (bytes.length > offset2 && this.serializer.handshake) {
            this.serializer.handshake(bytes, { offset: offset2 });
          }
          this.reconnectionToken = `${this.roomId}:${reconnectionToken}`;
          this.hasJoined = true;
          this.onJoin.invoke();
          this.connection.send([Protocol_1.Protocol.JOIN_ROOM]);
        } else if (code === Protocol_1.Protocol.ERROR) {
          const it = { offset: 1 };
          const code2 = schema_1.decode.number(bytes, it);
          const message = schema_1.decode.string(bytes, it);
          this.onError.invoke(code2, message);
        } else if (code === Protocol_1.Protocol.LEAVE_ROOM) {
          this.leave();
        } else if (code === Protocol_1.Protocol.ROOM_DATA_SCHEMA) {
          const it = { offset: 1 };
          const context = this.serializer.getState().constructor._context;
          const type = context.get(schema_1.decode.number(bytes, it));
          const message = new type();
          message.decode(bytes, it);
          this.dispatchMessage(type, message);
        } else if (code === Protocol_1.Protocol.ROOM_STATE) {
          bytes.shift();
          this.setState(bytes);
        } else if (code === Protocol_1.Protocol.ROOM_STATE_PATCH) {
          bytes.shift();
          this.patch(bytes);
        } else if (code === Protocol_1.Protocol.ROOM_DATA) {
          const it = { offset: 1 };
          const type = schema_1.decode.stringCheck(bytes, it) ? schema_1.decode.string(bytes, it) : schema_1.decode.number(bytes, it);
          const message = bytes.length > it.offset ? msgpack.decode(event.data, it.offset) : void 0;
          this.dispatchMessage(type, message);
        } else if (code === Protocol_1.Protocol.ROOM_DATA_BYTES) {
          const it = { offset: 1 };
          const type = schema_1.decode.stringCheck(bytes, it) ? schema_1.decode.string(bytes, it) : schema_1.decode.number(bytes, it);
          this.dispatchMessage(type, new Uint8Array(bytes.slice(it.offset)));
        }
      }
      setState(encodedState) {
        this.serializer.setState(encodedState);
        this.onStateChange.invoke(this.serializer.getState());
      }
      patch(binaryPatch) {
        this.serializer.patch(binaryPatch);
        this.onStateChange.invoke(this.serializer.getState());
      }
      dispatchMessage(type, message) {
        var _a;
        const messageType = this.getMessageHandlerKey(type);
        if (this.onMessageHandlers.events[messageType]) {
          this.onMessageHandlers.emit(messageType, message);
        } else if (this.onMessageHandlers.events["*"]) {
          this.onMessageHandlers.emit("*", type, message);
        } else {
          (_a = console.warn) === null || _a === void 0 ? void 0 : _a.call(console, `colyseus.js: onMessage() not registered for type '${type}'.`);
        }
      }
      destroy() {
        if (this.serializer) {
          this.serializer.teardown();
        }
      }
      getMessageHandlerKey(type) {
        switch (typeof type) {
          case "function":
            return `$${type._typeid}`;
          case "string":
            return type;
          case "number":
            return `i${type}`;
          default:
            throw new Error("invalid message type.");
        }
      }
    };
    exports.Room = Room;
  }
});

// node_modules/httpie/xhr/index.mjs
var xhr_exports = {};
__export(xhr_exports, {
  del: () => del,
  get: () => get,
  patch: () => patch,
  post: () => post,
  put: () => put,
  send: () => send
});
function apply(src, tar) {
  tar.headers = src.headers || {};
  tar.statusMessage = src.statusText;
  tar.statusCode = src.status;
  tar.data = src.response;
}
function send(method, uri, opts) {
  return new Promise(function(res, rej) {
    opts = opts || {};
    var req = new XMLHttpRequest();
    var k, tmp, arr, str5 = opts.body;
    var headers = opts.headers || {};
    if (opts.timeout)
      req.timeout = opts.timeout;
    req.ontimeout = req.onerror = function(err) {
      err.timeout = err.type == "timeout";
      rej(err);
    };
    req.open(method, uri.href || uri);
    req.onload = function() {
      arr = req.getAllResponseHeaders().trim().split(/[\r\n]+/);
      apply(req, req);
      while (tmp = arr.shift()) {
        tmp = tmp.split(": ");
        req.headers[tmp.shift().toLowerCase()] = tmp.join(": ");
      }
      tmp = req.headers["content-type"];
      if (tmp && !!~tmp.indexOf("application/json")) {
        try {
          req.data = JSON.parse(req.data, opts.reviver);
        } catch (err) {
          apply(req, err);
          return rej(err);
        }
      }
      (req.status >= 400 ? rej : res)(req);
    };
    if (typeof FormData < "u" && str5 instanceof FormData) {
    } else if (str5 && typeof str5 == "object") {
      headers["content-type"] = "application/json";
      str5 = JSON.stringify(str5);
    }
    req.withCredentials = !!opts.withCredentials;
    for (k in headers) {
      req.setRequestHeader(k, headers[k]);
    }
    req.send(str5);
  });
}
var get, post, patch, del, put;
var init_xhr = __esm({
  "node_modules/httpie/xhr/index.mjs"() {
    get = /* @__PURE__ */ send.bind(send, "GET");
    post = /* @__PURE__ */ send.bind(send, "POST");
    patch = /* @__PURE__ */ send.bind(send, "PATCH");
    del = /* @__PURE__ */ send.bind(send, "DELETE");
    put = /* @__PURE__ */ send.bind(send, "PUT");
  }
});

// node_modules/colyseus.js/lib/HTTP.js
var require_HTTP = __commonJS({
  "node_modules/colyseus.js/lib/HTTP.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule)
        return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod)
          if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
            __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTTP = void 0;
    var ServerError_1 = require_ServerError();
    var httpie = __importStar((init_xhr(), __toCommonJS(xhr_exports)));
    var HTTP = class {
      constructor(client) {
        this.client = client;
      }
      get(path, options = {}) {
        return this.request("get", path, options);
      }
      post(path, options = {}) {
        return this.request("post", path, options);
      }
      del(path, options = {}) {
        return this.request("del", path, options);
      }
      put(path, options = {}) {
        return this.request("put", path, options);
      }
      request(method, path, options = {}) {
        return httpie[method](this.client["getHttpEndpoint"](path), this.getOptions(options)).catch((e) => {
          var _a;
          const status = e.statusCode;
          const message = ((_a = e.data) === null || _a === void 0 ? void 0 : _a.error) || e.statusMessage || e.message;
          if (!status && !message) {
            throw e;
          }
          throw new ServerError_1.ServerError(status, message);
        });
      }
      getOptions(options) {
        if (this.authToken) {
          if (!options.headers) {
            options.headers = {};
          }
          options.headers["Authorization"] = `Bearer ${this.authToken}`;
        }
        if (typeof cc !== "undefined" && cc.sys && cc.sys.isNative) {
        } else {
          options.withCredentials = true;
        }
        return options;
      }
    };
    exports.HTTP = HTTP;
  }
});

// node_modules/colyseus.js/lib/Storage.js
var require_Storage = __commonJS({
  "node_modules/colyseus.js/lib/Storage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getItem = exports.removeItem = exports.setItem = void 0;
    var storage;
    function getStorage() {
      if (!storage) {
        try {
          storage = typeof cc !== "undefined" && cc.sys && cc.sys.localStorage ? cc.sys.localStorage : window.localStorage;
        } catch (e) {
        }
      }
      if (!storage) {
        storage = {
          cache: {},
          setItem: function(key, value) {
            this.cache[key] = value;
          },
          getItem: function(key) {
            this.cache[key];
          },
          removeItem: function(key) {
            delete this.cache[key];
          }
        };
      }
      return storage;
    }
    function setItem(key, value) {
      getStorage().setItem(key, value);
    }
    exports.setItem = setItem;
    function removeItem(key) {
      getStorage().removeItem(key);
    }
    exports.removeItem = removeItem;
    function getItem(key, callback) {
      const value = getStorage().getItem(key);
      if (typeof Promise === "undefined" || // old browsers
      !(value instanceof Promise)) {
        callback(value);
      } else {
        value.then((id) => callback(id));
      }
    }
    exports.getItem = getItem;
  }
});

// node_modules/colyseus.js/lib/Auth.js
var require_Auth = __commonJS({
  "node_modules/colyseus.js/lib/Auth.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
      if (kind === "m")
        throw new TypeError("Private method is not writable");
      if (kind === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    var _Auth__initialized;
    var _Auth__initializationPromise;
    var _Auth__signInWindow;
    var _Auth__events;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Auth = void 0;
    var Storage_1 = require_Storage();
    var nanoevents_1 = require_nanoevents();
    var Auth = class {
      constructor(http) {
        this.http = http;
        this.settings = {
          path: "/auth",
          key: "colyseus-auth-token"
        };
        _Auth__initialized.set(this, false);
        _Auth__initializationPromise.set(this, void 0);
        _Auth__signInWindow.set(this, void 0);
        _Auth__events.set(this, (0, nanoevents_1.createNanoEvents)());
        (0, Storage_1.getItem)(this.settings.key, (token) => this.token = token);
      }
      set token(token) {
        this.http.authToken = token;
      }
      get token() {
        return this.http.authToken;
      }
      onChange(callback) {
        const unbindChange = __classPrivateFieldGet(this, _Auth__events, "f").on("change", callback);
        if (!__classPrivateFieldGet(this, _Auth__initialized, "f")) {
          __classPrivateFieldSet(this, _Auth__initializationPromise, new Promise((resolve, reject) => {
            this.getUserData().then((userData) => {
              this.emitChange(Object.assign(Object.assign({}, userData), { token: this.token }));
            }).catch((e) => {
              this.emitChange({ user: null, token: void 0 });
            }).finally(() => {
              resolve();
            });
          }), "f");
        }
        __classPrivateFieldSet(this, _Auth__initialized, true, "f");
        return unbindChange;
      }
      getUserData() {
        return __awaiter(this, void 0, void 0, function* () {
          if (this.token) {
            return (yield this.http.get(`${this.settings.path}/userdata`)).data;
          } else {
            throw new Error("missing auth.token");
          }
        });
      }
      registerWithEmailAndPassword(email, password, options) {
        return __awaiter(this, void 0, void 0, function* () {
          const data = (yield this.http.post(`${this.settings.path}/register`, {
            body: { email, password, options }
          })).data;
          this.emitChange(data);
          return data;
        });
      }
      signInWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
          const data = (yield this.http.post(`${this.settings.path}/login`, {
            body: { email, password }
          })).data;
          this.emitChange(data);
          return data;
        });
      }
      signInAnonymously(options) {
        return __awaiter(this, void 0, void 0, function* () {
          const data = (yield this.http.post(`${this.settings.path}/anonymous`, {
            body: { options }
          })).data;
          this.emitChange(data);
          return data;
        });
      }
      sendPasswordResetEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
          return (yield this.http.post(`${this.settings.path}/forgot-password`, {
            body: { email }
          })).data;
        });
      }
      signInWithProvider(providerName, settings = {}) {
        return __awaiter(this, void 0, void 0, function* () {
          return new Promise((resolve, reject) => {
            const w = settings.width || 480;
            const h = settings.height || 768;
            const upgradingToken = this.token ? `?token=${this.token}` : "";
            const title = `Login with ${providerName[0].toUpperCase() + providerName.substring(1)}`;
            const url = this.http["client"]["getHttpEndpoint"](`${settings.prefix || `${this.settings.path}/provider`}/${providerName}${upgradingToken}`);
            const left = screen.width / 2 - w / 2;
            const top = screen.height / 2 - h / 2;
            __classPrivateFieldSet(this, _Auth__signInWindow, window.open(url, title, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left), "f");
            const onMessage = (event) => {
              if (event.data.user === void 0 && event.data.token === void 0) {
                return;
              }
              clearInterval(rejectionChecker);
              __classPrivateFieldGet(this, _Auth__signInWindow, "f").close();
              __classPrivateFieldSet(this, _Auth__signInWindow, void 0, "f");
              window.removeEventListener("message", onMessage);
              if (event.data.error !== void 0) {
                reject(event.data.error);
              } else {
                resolve(event.data);
                this.emitChange(event.data);
              }
            };
            const rejectionChecker = setInterval(() => {
              if (!__classPrivateFieldGet(this, _Auth__signInWindow, "f") || __classPrivateFieldGet(this, _Auth__signInWindow, "f").closed) {
                __classPrivateFieldSet(this, _Auth__signInWindow, void 0, "f");
                reject("cancelled");
                window.removeEventListener("message", onMessage);
              }
            }, 200);
            window.addEventListener("message", onMessage);
          });
        });
      }
      signOut() {
        return __awaiter(this, void 0, void 0, function* () {
          this.emitChange({ user: null, token: null });
        });
      }
      emitChange(authData) {
        if (authData.token !== void 0) {
          this.token = authData.token;
          if (authData.token === null) {
            (0, Storage_1.removeItem)(this.settings.key);
          } else {
            (0, Storage_1.setItem)(this.settings.key, authData.token);
          }
        }
        __classPrivateFieldGet(this, _Auth__events, "f").emit("change", authData);
      }
    };
    exports.Auth = Auth;
    _Auth__initialized = /* @__PURE__ */ new WeakMap(), _Auth__initializationPromise = /* @__PURE__ */ new WeakMap(), _Auth__signInWindow = /* @__PURE__ */ new WeakMap(), _Auth__events = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/colyseus.js/lib/Client.js
var require_Client = __commonJS({
  "node_modules/colyseus.js/lib/Client.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Client = exports.MatchMakeError = void 0;
    var ServerError_1 = require_ServerError();
    var Room_1 = require_Room();
    var HTTP_1 = require_HTTP();
    var Auth_1 = require_Auth();
    var MatchMakeError = class extends Error {
      constructor(message, code) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, MatchMakeError.prototype);
      }
    };
    exports.MatchMakeError = MatchMakeError;
    var DEFAULT_ENDPOINT = typeof window !== "undefined" && typeof ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hostname) !== "undefined" ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${window.location.port && `:${window.location.port}`}` : "ws://127.0.0.1:2567";
    var Client2 = class {
      constructor(settings = DEFAULT_ENDPOINT) {
        if (typeof settings === "string") {
          const url = settings.startsWith("/") ? new URL(settings, DEFAULT_ENDPOINT) : new URL(settings);
          const secure = url.protocol === "https:" || url.protocol === "wss:";
          const port = Number(url.port || (secure ? 443 : 80));
          this.settings = {
            hostname: url.hostname,
            pathname: url.pathname,
            port,
            secure
          };
        } else {
          if (settings.port === void 0) {
            settings.port = settings.secure ? 443 : 80;
          }
          if (settings.pathname === void 0) {
            settings.pathname = "";
          }
          this.settings = settings;
        }
        if (this.settings.pathname.endsWith("/")) {
          this.settings.pathname = this.settings.pathname.slice(0, -1);
        }
        this.http = new HTTP_1.HTTP(this);
        this.auth = new Auth_1.Auth(this.http);
      }
      joinOrCreate(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield this.createMatchMakeRequest("joinOrCreate", roomName, options, rootSchema);
        });
      }
      create(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield this.createMatchMakeRequest("create", roomName, options, rootSchema);
        });
      }
      join(roomName, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield this.createMatchMakeRequest("join", roomName, options, rootSchema);
        });
      }
      joinById(roomId, options = {}, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield this.createMatchMakeRequest("joinById", roomId, options, rootSchema);
        });
      }
      /**
       * Re-establish connection with a room this client was previously connected to.
       *
       * @param reconnectionToken The `room.reconnectionToken` from previously connected room.
       * @param rootSchema (optional) Concrete root schema definition
       * @returns Promise<Room>
       */
      reconnect(reconnectionToken, rootSchema) {
        return __awaiter(this, void 0, void 0, function* () {
          if (typeof reconnectionToken === "string" && typeof rootSchema === "string") {
            throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");
          }
          const [roomId, token] = reconnectionToken.split(":");
          if (!roomId || !token) {
            throw new Error("Invalid reconnection token format.\nThe format should be roomId:reconnectionToken");
          }
          return yield this.createMatchMakeRequest("reconnect", roomId, { reconnectionToken: token }, rootSchema);
        });
      }
      getAvailableRooms(roomName = "") {
        return __awaiter(this, void 0, void 0, function* () {
          return (yield this.http.get(`matchmake/${roomName}`, {
            headers: {
              "Accept": "application/json"
            }
          })).data;
        });
      }
      consumeSeatReservation(response, rootSchema, reuseRoomInstance) {
        return __awaiter(this, void 0, void 0, function* () {
          const room = this.createRoom(response.room.name, rootSchema);
          room.roomId = response.room.roomId;
          room.sessionId = response.sessionId;
          const options = { sessionId: room.sessionId };
          if (response.reconnectionToken) {
            options.reconnectionToken = response.reconnectionToken;
          }
          const targetRoom = reuseRoomInstance || room;
          room.connect(this.buildEndpoint(response.room, options), response.devMode && (() => __awaiter(this, void 0, void 0, function* () {
            console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} Re-establishing connection with room id '${room.roomId}'...`);
            let retryCount = 0;
            let retryMaxRetries = 8;
            const retryReconnection = () => __awaiter(this, void 0, void 0, function* () {
              retryCount++;
              try {
                yield this.consumeSeatReservation(response, rootSchema, targetRoom);
                console.info(`[Colyseus devMode]: ${String.fromCodePoint(9989)} Successfully re-established connection with room '${room.roomId}'`);
              } catch (e) {
                if (retryCount < retryMaxRetries) {
                  console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} retrying... (${retryCount} out of ${retryMaxRetries})`);
                  setTimeout(retryReconnection, 2e3);
                } else {
                  console.info(`[Colyseus devMode]: ${String.fromCodePoint(10060)} Failed to reconnect. Is your server running? Please check server logs.`);
                }
              }
            });
            setTimeout(retryReconnection, 2e3);
          })), targetRoom);
          return new Promise((resolve, reject) => {
            const onError = (code, message) => reject(new ServerError_1.ServerError(code, message));
            targetRoom.onError.once(onError);
            targetRoom["onJoin"].once(() => {
              targetRoom.onError.remove(onError);
              resolve(targetRoom);
            });
          });
        });
      }
      createMatchMakeRequest(method, roomName, options = {}, rootSchema, reuseRoomInstance) {
        return __awaiter(this, void 0, void 0, function* () {
          const response = (yield this.http.post(`matchmake/${method}/${roomName}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(options)
          })).data;
          if (response.error) {
            throw new MatchMakeError(response.error, response.code);
          }
          if (method === "reconnect") {
            response.reconnectionToken = options.reconnectionToken;
          }
          return yield this.consumeSeatReservation(response, rootSchema, reuseRoomInstance);
        });
      }
      createRoom(roomName, rootSchema) {
        return new Room_1.Room(roomName, rootSchema);
      }
      buildEndpoint(room, options = {}) {
        const params = [];
        for (const name in options) {
          if (!options.hasOwnProperty(name)) {
            continue;
          }
          params.push(`${name}=${options[name]}`);
        }
        let endpoint = this.settings.secure ? "wss://" : "ws://";
        if (room.publicAddress) {
          endpoint += `${room.publicAddress}`;
        } else {
          endpoint += `${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;
        }
        return `${endpoint}/${room.processId}/${room.roomId}?${params.join("&")}`;
      }
      getHttpEndpoint(segments = "") {
        const path = segments.startsWith("/") ? segments : `/${segments}`;
        return `${this.settings.secure ? "https" : "http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${path}`;
      }
      getEndpointPort() {
        return this.settings.port !== 80 && this.settings.port !== 443 ? `:${this.settings.port}` : "";
      }
    };
    exports.Client = Client2;
  }
});

// node_modules/colyseus.js/lib/serializer/SchemaSerializer.js
var require_SchemaSerializer = __commonJS({
  "node_modules/colyseus.js/lib/serializer/SchemaSerializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchemaSerializer = void 0;
    var schema_1 = require_umd();
    var SchemaSerializer = class {
      setState(rawState) {
        return this.state.decode(rawState);
      }
      getState() {
        return this.state;
      }
      patch(patches) {
        return this.state.decode(patches);
      }
      teardown() {
        var _a, _b;
        (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a["$changes"]) === null || _b === void 0 ? void 0 : _b.root.clearRefs();
      }
      handshake(bytes, it) {
        if (this.state) {
          const reflection = new schema_1.Reflection();
          reflection.decode(bytes, it);
        } else {
          this.state = schema_1.Reflection.decode(bytes, it);
        }
      }
    };
    exports.SchemaSerializer = SchemaSerializer;
  }
});

// node_modules/colyseus.js/lib/serializer/NoneSerializer.js
var require_NoneSerializer = __commonJS({
  "node_modules/colyseus.js/lib/serializer/NoneSerializer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoneSerializer = void 0;
    var NoneSerializer = class {
      setState(rawState) {
      }
      getState() {
        return null;
      }
      patch(patches) {
      }
      teardown() {
      }
      handshake(bytes) {
      }
    };
    exports.NoneSerializer = NoneSerializer;
  }
});

// node_modules/colyseus.js/lib/index.js
var require_lib = __commonJS({
  "node_modules/colyseus.js/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SchemaSerializer = exports.registerSerializer = exports.Auth = exports.Room = exports.ErrorCode = exports.Protocol = exports.Client = void 0;
    require_legacy();
    var Client_1 = require_Client();
    Object.defineProperty(exports, "Client", { enumerable: true, get: function() {
      return Client_1.Client;
    } });
    var Protocol_1 = require_Protocol();
    Object.defineProperty(exports, "Protocol", { enumerable: true, get: function() {
      return Protocol_1.Protocol;
    } });
    Object.defineProperty(exports, "ErrorCode", { enumerable: true, get: function() {
      return Protocol_1.ErrorCode;
    } });
    var Room_1 = require_Room();
    Object.defineProperty(exports, "Room", { enumerable: true, get: function() {
      return Room_1.Room;
    } });
    var Auth_1 = require_Auth();
    Object.defineProperty(exports, "Auth", { enumerable: true, get: function() {
      return Auth_1.Auth;
    } });
    var SchemaSerializer_1 = require_SchemaSerializer();
    Object.defineProperty(exports, "SchemaSerializer", { enumerable: true, get: function() {
      return SchemaSerializer_1.SchemaSerializer;
    } });
    var NoneSerializer_1 = require_NoneSerializer();
    var Serializer_1 = require_Serializer();
    Object.defineProperty(exports, "registerSerializer", { enumerable: true, get: function() {
      return Serializer_1.registerSerializer;
    } });
    (0, Serializer_1.registerSerializer)("schema", SchemaSerializer_1.SchemaSerializer);
    (0, Serializer_1.registerSerializer)("none", NoneSerializer_1.NoneSerializer);
  }
});

// node_modules/wasm-feature-detect/dist/esm/index.js
var simd = async () => WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
var threads = () => (async (e) => {
  try {
    return "undefined" != typeof MessageChannel && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(e);
  } catch (e2) {
    return false;
  }
})(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));

// node_modules/@wonderlandengine/api/dist/property.js
var Type;
(function(Type2) {
  Type2[Type2["Native"] = 0] = "Native";
  Type2[Type2["Bool"] = 1] = "Bool";
  Type2[Type2["Int"] = 2] = "Int";
  Type2[Type2["Float"] = 3] = "Float";
  Type2[Type2["String"] = 4] = "String";
  Type2[Type2["Enum"] = 5] = "Enum";
  Type2[Type2["Object"] = 6] = "Object";
  Type2[Type2["Mesh"] = 7] = "Mesh";
  Type2[Type2["Texture"] = 8] = "Texture";
  Type2[Type2["Material"] = 9] = "Material";
  Type2[Type2["Animation"] = 10] = "Animation";
  Type2[Type2["Skin"] = 11] = "Skin";
  Type2[Type2["Color"] = 12] = "Color";
  Type2[Type2["Vector2"] = 13] = "Vector2";
  Type2[Type2["Vector3"] = 14] = "Vector3";
  Type2[Type2["Vector4"] = 15] = "Vector4";
})(Type || (Type = {}));
var DefaultPropertyCloner = class {
  clone(type, value) {
    switch (type) {
      case Type.Color:
      case Type.Vector2:
      case Type.Vector3:
      case Type.Vector4:
        return value.slice();
      default:
        return value;
    }
  }
};
var defaultPropertyCloner = new DefaultPropertyCloner();
var Property = {
  /**
   * Create an boolean property.
   *
   * @param defaultValue The default value. If not provided, defaults to `false`.
   */
  bool(defaultValue = false) {
    return { type: Type.Bool, default: defaultValue };
  },
  /**
   * Create an integer property.
   *
   * @param defaultValue The default value. If not provided, defaults to `0`.
   */
  int(defaultValue = 0) {
    return { type: Type.Int, default: defaultValue };
  },
  /**
   * Create an float property.
   *
   * @param defaultValue The default value. If not provided, defaults to `0.0`.
   */
  float(defaultValue = 0) {
    return { type: Type.Float, default: defaultValue };
  },
  /**
   * Create an string property.
   *
   * @param defaultValue The default value. If not provided, defaults to `''`.
   */
  string(defaultValue = "") {
    return { type: Type.String, default: defaultValue };
  },
  /**
   * Create an enumeration property.
   *
   * @param values The list of values.
   * @param defaultValue The default value. Can be a string or an index into
   *     `values`. If not provided, defaults to the first element.
   */
  enum(values, defaultValue) {
    return { type: Type.Enum, values, default: defaultValue };
  },
  /** Create an {@link Object3D} reference property. */
  object(opts) {
    return { type: Type.Object, default: null, required: opts?.required ?? false };
  },
  /** Create a {@link Mesh} reference property. */
  mesh(opts) {
    return { type: Type.Mesh, default: null, required: opts?.required ?? false };
  },
  /** Create a {@link Texture} reference property. */
  texture(opts) {
    return { type: Type.Texture, default: null, required: opts?.required ?? false };
  },
  /** Create a {@link Material} reference property. */
  material(opts) {
    return { type: Type.Material, default: null, required: opts?.required ?? false };
  },
  /** Create an {@link Animation} reference property. */
  animation(opts) {
    return { type: Type.Animation, default: null, required: opts?.required ?? false };
  },
  /** Create a {@link Skin} reference property. */
  skin(opts) {
    return { type: Type.Skin, default: null, required: opts?.required ?? false };
  },
  /**
   * Create a color property.
   *
   * @param r The red component, in the range [0; 1].
   * @param g The green component, in the range [0; 1].
   * @param b The blue component, in the range [0; 1].
   * @param a The alpha component, in the range [0; 1].
   */
  color(r = 0, g = 0, b = 0, a = 1) {
    return { type: Type.Color, default: [r, g, b, a] };
  },
  /**
   * Create a two-element vector property.
   *
   * @param x The x component.
   * @param y The y component.
   */
  vector2(x = 0, y = 0) {
    return { type: Type.Vector2, default: [x, y] };
  },
  /**
   * Create a three-element vector property.
   *
   * @param x The x component.
   * @param y The y component.
   * @param z The z component.
   */
  vector3(x = 0, y = 0, z = 0) {
    return { type: Type.Vector3, default: [x, y, z] };
  },
  /**
   * Create a four-element vector property.
   *
   * @param x The x component.
   * @param y The y component.
   * @param z The z component.
   * @param w The w component.
   */
  vector4(x = 0, y = 0, z = 0, w = 0) {
    return { type: Type.Vector4, default: [x, y, z, w] };
  }
};

// node_modules/@wonderlandengine/api/dist/decorators.js
function propertyDecorator(data) {
  return function(target, propertyKey) {
    const ctor = target.constructor;
    ctor.Properties = ctor.hasOwnProperty("Properties") ? ctor.Properties : {};
    ctor.Properties[propertyKey] = data;
  };
}
function enumerable() {
  return function(_, __, descriptor) {
    descriptor.enumerable = true;
  };
}
function nativeProperty() {
  return function(target, propertyKey, descriptor) {
    enumerable()(target, propertyKey, descriptor);
    propertyDecorator({ type: Type.Native })(target, propertyKey);
  };
}
var property = {};
for (const name in Property) {
  property[name] = (...args) => {
    const functor = Property[name];
    return propertyDecorator(functor(...args));
  };
}

// node_modules/@wonderlandengine/api/dist/utils/object.js
function isString(value) {
  if (value === "")
    return true;
  return value && (typeof value === "string" || value.constructor === String);
}
function isNumber(value) {
  if (value === null || value === void 0)
    return false;
  return typeof value === "number" || value.constructor === Number;
}
function isImageLike(value) {
  return value instanceof HTMLImageElement || value instanceof HTMLVideoElement || value instanceof HTMLCanvasElement;
}

// node_modules/@wonderlandengine/api/dist/utils/event.js
var TransactionType;
(function(TransactionType2) {
  TransactionType2[TransactionType2["Addition"] = 1] = "Addition";
  TransactionType2[TransactionType2["Removal"] = 2] = "Removal";
})(TransactionType || (TransactionType = {}));
var Emitter = class {
  /**
   * List of listeners to trigger when `notify` is called.
   *
   * @hidden
   */
  _listeners = [];
  /**
   * `true` if the emitter is currently notifying listeners. This
   * is used to defer addition and removal.
   *
   * @hidden
   */
  _notifying = false;
  /**
   * Pending additions / removals, performed during a notification.
   *
   * @hidden
   */
  _transactions = [];
  /**
   * Register a new listener to be triggered on {@link Emitter.notify}.
   *
   * Basic usage:
   *
   * ```js
   * emitter.add((data) => {
   *     console.log('event received!');
   *     console.log(data);
   * });
   * ```
   *
   * Automatically remove the listener when an event is received:
   *
   * ```js
   * emitter.add((data) => {
   *     console.log('event received!');
   *     console.log(data);
   * }, {once: true});
   * ```
   *
   * @param listener The callback to register.
   * @param opts The listener options. For more information, please have a look
   *     at the {@link ListenerOptions} interface.
   *
   * @returns Reference to self (for method chaining)
   */
  add(listener, opts = {}) {
    const { once = false, id = void 0 } = opts;
    const data = { id, once, callback: listener };
    if (this._notifying) {
      this._transactions.push({ type: TransactionType.Addition, data });
      return this;
    }
    this._listeners.push(data);
    return this;
  }
  /**
   * Equivalent to {@link Emitter.add}.
   *
   * @param listeners The callback(s) to register.
   * @returns Reference to self (for method chaining).
   *
   * @deprecated Please use {@link Emitter.add} instead.
   */
  push(...listeners) {
    for (const cb of listeners)
      this.add(cb);
    return this;
  }
  /**
   * Register a new listener to be triggered on {@link Emitter.notify}.
   *
   * Once notified, the listener will be automatically removed.
   *
   * The method is equivalent to calling {@link Emitter.add} with:
   *
   * ```js
   * emitter.add(listener, {once: true});
   * ```
   *
   * @param listener The callback to register.
   *
   * @returns Reference to self (for method chaining).
   */
  once(listener) {
    return this.add(listener, { once: true });
  }
  /**
   * Remove a registered listener.
   *
   * Usage with a callback:
   *
   * ```js
   * const listener = (data) => console.log(data);
   * emitter.add(listener);
   *
   * // Remove using the callback reference:
   * emitter.remove(listener);
   * ```
   *
   * Usage with an id:
   *
   * ```js
   * emitter.add((data) => console.log(data), {id: 'my-callback'});
   *
   * // Remove using the id:
   * emitter.remove('my-callback');
   * ```
   *
   * Using identifiers, you will need to ensure your value is unique to avoid
   * removing listeners from other libraries, e.g.,:
   *
   * ```js
   * emitter.add((data) => console.log(data), {id: 'non-unique'});
   * // This second listener could be added by a third-party library.
   * emitter.add((data) => console.log('Hello From Library!'), {id: 'non-unique'});
   *
   * // Ho Snap! This also removed the library listener!
   * emitter.remove('non-unique');
   * ```
   *
   * The identifier can be any type. However, remember that the comparison will be
   * by-value for primitive types (string, number), but by reference for objects.
   *
   * Example:
   *
   * ```js
   * emitter.add(() => console.log('Hello'), {id: {value: 42}});
   * emitter.add(() => console.log('World!'), {id: {value: 42}});
   * emitter.remove({value: 42}); // None of the above listeners match!
   * emitter.notify(); // Prints 'Hello' and 'World!'.
   * ```
   *
   * Here, both emitters have id `{value: 42}`, but the comparison is made by reference. Thus,
   * the `remove()` call has no effect. We can make it work by doing:
   *
   * ```js
   * const id = {value: 42};
   * emitter.add(() => console.log('Hello'), {id});
   * emitter.add(() => console.log('World!'), {id});
   * emitter.remove(id); // Same reference, it works!
   * emitter.notify(); // Doesn't print.
   * ```
   *
   * @param listener The registered callback or a value representing the `id`.
   *
   * @returns Reference to self (for method chaining)
   */
  remove(listener) {
    if (this._notifying) {
      this._transactions.push({ type: TransactionType.Removal, data: listener });
      return this;
    }
    const listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      const target = listeners[i];
      if (target.callback === listener || target.id === listener) {
        listeners.splice(i--, 1);
      }
    }
    return this;
  }
  /**
   * Check whether the listener is registered.
   *
   * @note This method performs a linear search.
   *
   * * @note Doesn't account for pending listeners, i.e.,
   * listeners added / removed during a notification.
   *
   * @param listener The registered callback or a value representing the `id`.
   * @returns `true` if the handle is found, `false` otherwise.
   */
  has(listener) {
    const listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      const target = listeners[i];
      if (target.callback === listener || target.id === listener)
        return true;
    }
    return false;
  }
  /**
   * Notify listeners with the given data object.
   *
   * @note This method ensures all listeners are called even if
   * an exception is thrown. For (possibly) faster notification,
   * please use {@link Emitter.notifyUnsafe}.
   *
   * @param data The data to pass to listener when invoked.
   */
  notify(...data) {
    const listeners = this._listeners;
    this._notifying = true;
    for (let i = 0; i < listeners.length; ++i) {
      const listener = listeners[i];
      if (listener.once)
        listeners.splice(i--, 1);
      try {
        listener.callback(...data);
      } catch (e) {
        console.error(e);
      }
    }
    this._notifying = false;
    this._flushTransactions();
  }
  /**
   * Notify listeners with the given data object.
   *
   * @note Because this method doesn't catch exceptions, some listeners
   * will be skipped on a throw. Please use {@link Emitter.notify} for safe
   * notification.
   *
   * @param data The data to pass to listener when invoked.
   */
  notifyUnsafe(...data) {
    const listeners = this._listeners;
    for (let i = 0; i < listeners.length; ++i) {
      const listener = listeners[i];
      if (listener.once)
        listeners.splice(i--, 1);
      listener.callback(...data);
    }
    this._flushTransactions();
  }
  /**
   * Return a promise that will resolve on the next event.
   *
   * @note The promise might never resolve if no event is sent.
   *
   * @returns A promise that resolves with the data passed to
   *     {@link Emitter.notify}.
   */
  promise() {
    return new Promise((res, _) => {
      this.once((...args) => {
        if (args.length > 1) {
          res(args);
        } else {
          res(args[0]);
        }
      });
    });
  }
  /**
   * Number of listeners.
   *
   * @note Doesn't account for pending listeners, i.e.,
   * listeners added / removed during a notification.
   */
  get listenerCount() {
    return this._listeners.length;
  }
  /** `true` if it has no listeners, `false` otherwise. */
  get isEmpty() {
    return this.listenerCount === 0;
  }
  /**
   * Flush all pending transactions.
   *
   * @hidden
   */
  _flushTransactions() {
    const listeners = this._listeners;
    for (const transaction of this._transactions) {
      if (transaction.type === TransactionType.Addition) {
        listeners.push(transaction.data);
      } else {
        this.remove(transaction.data);
      }
    }
    this._transactions.length = 0;
  }
};
var RetainEmitterUndefined = {};
var RetainEmitter = class extends Emitter {
  /** Pre-resolved data. @hidden */
  _event = RetainEmitterUndefined;
  /**
   * Emitter target used to reset the state of this emitter.
   *
   * @hidden
   */
  _reset;
  /** @override */
  add(listener, opts) {
    const immediate = opts?.immediate ?? true;
    if (this._event !== RetainEmitterUndefined && immediate) {
      listener(...this._event);
    }
    super.add(listener, opts);
    return this;
  }
  /**
   * @override
   *
   * @param listener The callback to register.
   * @param immediate If `true`, directly resolves if the emitter retains a value.
   *
   * @returns Reference to self (for method chaining).
   */
  once(listener, immediate) {
    return this.add(listener, { once: true, immediate });
  }
  /** @override */
  notify(...data) {
    this._event = data;
    super.notify(...data);
  }
  /** @override */
  notifyUnsafe(...data) {
    this._event = data;
    super.notifyUnsafe(...data);
  }
  /**
   * Reset the state of the emitter.
   *
   * Further call to {@link Emitter.add} will not automatically resolve,
   * until a new call to {@link Emitter.notify} is performed.
   *
   * @returns Reference to self (for method chaining)
   */
  reset() {
    this._event = RetainEmitterUndefined;
    return this;
  }
  /** Returns the retained data, or `undefined` if no data was retained. */
  get data() {
    return this.isDataRetained ? this._event : void 0;
  }
  /** `true` if data is retained from the last event, `false` otherwise. */
  get isDataRetained() {
    return this._event !== RetainEmitterUndefined;
  }
};

// node_modules/@wonderlandengine/api/dist/resources/resource.js
function createDestroyedProxy(host, type) {
  return new Proxy({}, {
    get(_, param) {
      if (param === "isDestroyed")
        return true;
      throw new Error(`Cannot read '${param}' of destroyed '${type.name}' resource from ${host}`);
    },
    set(_, param) {
      throw new Error(`Cannot write '${param}' of destroyed '${type.name}' resource from ${host}`);
    }
  });
}
var Resource = class {
  /** Relative index in the host. @hidden */
  _index = -1;
  /** For compatibility with SceneResource. @hidden */
  _id = -1;
  /** @hidden */
  _engine;
  constructor(engine2, index) {
    this._engine = engine2;
    this._index = index;
    this._id = index;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
  /** Index of this resource in the {@link Scene}'s manager. */
  get index() {
    return this._index;
  }
  /**
   * Checks equality by comparing ids and **not** the JavaScript reference.
   *
   * @deprecated Use JavaScript reference comparison instead:
   *
   * ```js
   * const meshA = engine.meshes.create({vertexCount: 1});
   * const meshB = engine.meshes.create({vertexCount: 1});
   * const meshC = meshB;
   * console.log(meshA === meshB); // false
   * console.log(meshA === meshA); // true
   * console.log(meshB === meshC); // true
   * ```
   */
  equals(other) {
    if (!other)
      return false;
    return this._index === other._index;
  }
  /**
   * `true` if the object is destroyed, `false` otherwise.
   *
   * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
   * reading a class attribute / method will throw.
   */
  get isDestroyed() {
    return this._index <= 0;
  }
};
var SceneResource = class {
  /** @hidden */
  static _pack(scene, index) {
    return scene << 22 | index;
  }
  /** Relative index in the host. @hidden */
  _index = -1;
  /** For compatibility with SceneResource. @hidden */
  _id = -1;
  /** @hidden */
  _scene;
  constructor(scene, index) {
    this._scene = scene;
    this._index = index;
    this._id = SceneResource._pack(scene._index, index);
  }
  /**
   * Checks equality by comparing ids and **not** the JavaScript reference.
   *
   * @deprecated Use JavaScript reference comparison instead:
   *
   * ```js
   * const meshA = engine.meshes.create({vertexCount: 1});
   * const meshB = engine.meshes.create({vertexCount: 1});
   * const meshC = meshB;
   * console.log(meshA === meshB); // false
   * console.log(meshA === meshA); // true
   * console.log(meshB === meshC); // true
   * ```
   */
  equals(other) {
    if (!other)
      return false;
    return this._id === other._id;
  }
  /** Hosting instance. */
  get scene() {
    return this._scene;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._scene.engine;
  }
  /** Index of this resource in the {@link Scene}'s manager. */
  get index() {
    return this._index;
  }
  /**
   * `true` if the object is destroyed, `false` otherwise.
   *
   * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
   * reading a class attribute / method will throw.
   */
  get isDestroyed() {
    return this._id <= 0;
  }
};
var ResourceManager = class {
  /** @hidden */
  _host;
  /** Cache. @hidden */
  _cache = [];
  /** Resource class. @hidden */
  _template;
  /** Destructor proxy, used if {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`. @hidden */
  _destructor = null;
  _engine;
  /**
   * Create a new manager
   *
   * @param host The host containing the managed resources.
   * @param Class The class to instantiate when wrapping an index.
   *
   * @hidden
   */
  constructor(host, Class) {
    this._host = host;
    this._template = Class;
    this._engine = host.engine ?? host;
  }
  /**
   * Wrap the index into a resource instance.
   *
   * @note The index is relative to the host, i.e., doesn't pack the host index (if any).
   *
   * @param index The resource index.
   * @returns
   */
  wrap(index) {
    if (index <= 0)
      return null;
    const texture = this._cache[index] ?? (this._cache[index] = new this._template(this._host, index));
    return texture;
  }
  /**
   * Retrieve the resource at the given index.
   *
   * @note The index is relative to the host, i.e., doesn't pack the host index.
   */
  get(index) {
    return this._cache[index] ?? null;
  }
  /** Number of textures allocated in the manager. */
  get allocatedCount() {
    return this._cache.length;
  }
  /**
   * Number of textures in the manager.
   *
   * @note For performance reasons, avoid calling this method when possible.
   */
  get count() {
    let count = 0;
    for (const res of this._cache) {
      if (res && res.index >= 0)
        ++count;
    }
    return count;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
  /**
   * Destroy the instance.
   *
   * @note This method takes care of the prototype destruction.
   *
   * @hidden
   */
  _destroy(instance) {
    const index = instance.index;
    instance._index = -1;
    instance._id = -1;
    this._cache[index] = null;
    if (!this.engine.erasePrototypeOnDestroy)
      return;
    if (!this._destructor)
      this._destructor = createDestroyedProxy(this._host, this._template);
    Object.setPrototypeOf(instance, this._destructor);
  }
  /**
   * Mark all instances as destroyed.
   *
   * @hidden
   */
  _clear() {
    if (!this.engine.erasePrototypeOnDestroy)
      return;
    for (let i = 0; i < this._cache.length; ++i) {
      const instance = this._cache[i];
      if (instance)
        this._destroy(instance);
    }
    this._cache.length = 0;
  }
};

// node_modules/@wonderlandengine/api/dist/component.js
var ComponentManagers = class {
  /** Animation manager index. */
  animation = -1;
  /** Collision manager index. */
  collision = -1;
  /** JavaScript manager index. */
  js = -1;
  /** Physx manager index. */
  physx = -1;
  /** View manager index. */
  view = -1;
  /**
   * Component class instances per type to avoid GC.
   *
   * @note Maps the manager index to the list of components.
   *
   * @todo: Refactor ResourceManager and re-use for components.
   */
  _cache = [];
  /** Manager index to component class. */
  _constructors;
  /* Manager name to the manager index. */
  _nativeManagers = /* @__PURE__ */ new Map();
  /** Host instance. */
  _scene;
  constructor(scene) {
    this._scene = scene;
    const wasm = this._scene.engine.wasm;
    const native = [
      AnimationComponent,
      CollisionComponent,
      InputComponent,
      LightComponent,
      MeshComponent,
      PhysXComponent,
      TextComponent,
      ViewComponent
    ];
    this._cache = new Array(native.length);
    this._constructors = new Array(native.length);
    for (const Class of native) {
      const ptr2 = wasm.tempUTF8(Class.TypeName);
      const manager = wasm._wl_scene_get_component_manager_index(scene._index, ptr2);
      this._constructors;
      this._constructors[manager] = Class;
      this._cache[manager] = [];
      this._nativeManagers.set(Class.TypeName, manager);
    }
    this.animation = this._nativeManagers.get(AnimationComponent.TypeName);
    this.collision = this._nativeManagers.get(CollisionComponent.TypeName);
    this.physx = this._nativeManagers.get(PhysXComponent.TypeName);
    this.view = this._nativeManagers.get(ViewComponent.TypeName);
    const ptr = wasm.tempUTF8("js");
    this.js = wasm._wl_scene_get_component_manager_index(scene._index, ptr);
    this._cache[this.js] = [];
  }
  createJs(index, id, type, object) {
    const wasm = this._scene.engine.wasm;
    const ctor = wasm._componentTypes[type];
    if (!ctor) {
      throw new Error(`Type index ${type} isn't registered`);
    }
    const log = this._scene.engine.log;
    let component = null;
    try {
      component = new ctor(this._scene, this.js, id);
    } catch (e) {
      log.error(LogTag.Component, `Exception during instantiation of component ${ctor.TypeName}`);
      log.error(LogTag.Component, e);
      component = new BrokenComponent(this._scene);
    }
    component._object = this._scene.wrap(object);
    try {
      component.resetProperties();
    } catch (e) {
      log.error(LogTag.Component, `Exception during ${component.type} resetProperties() on object ${component.object.name}`);
      log.error(LogTag.Component, e);
    }
    this._scene._jsComponents[index] = component;
    this._cache[this.js][id] = component;
    return component;
  }
  /**
   * Retrieve a cached component.
   *
   * @param manager The manager index.
   * @param id The component id.
   * @returns The component if cached, `null` otherwise.
   */
  get(manager, id) {
    return this._cache[manager][id] ?? null;
  }
  /**
   * Wrap the animation.
   *
   * @param id Id to wrap.
   * @returns The previous instance if it was cached, or a new one.
   */
  wrapAnimation(id) {
    return this.wrapNative(this.animation, id);
  }
  /**
   * Wrap the collision.
   *
   * @param id Id to wrap.
   * @returns The previous instance if it was cached, or a new one.
   */
  wrapCollision(id) {
    return this.wrapNative(this.collision, id);
  }
  /**
   * Wrap the view.
   *
   * @param id Id to wrap.
   * @returns The previous instance if it was cached, or a new one.
   */
  wrapView(id) {
    return this.wrapNative(this.view, id);
  }
  /**
   * Wrap the physx.
   *
   * @param id Id to wrap.
   * @returns The previous instance if it was cached, or a new one.
   */
  wrapPhysx(id) {
    return this.wrapNative(this.physx, id);
  }
  /**
   * Retrieves a component instance if it exists, or create and cache
   * a new one.
   *
   * @note This api is meant to be used internally. Please have a look at
   * {@link Object3D.addComponent} instead.
   *
   * @param componentType Component manager index
   * @param componentId Component id in the manager
   *
   * @returns JavaScript instance wrapping the native component
   */
  wrapNative(manager, id) {
    if (id < 0)
      return null;
    const cache = this._cache[manager];
    if (cache[id])
      return cache[id];
    const scene = this._scene;
    const Class = this._constructors[manager];
    const component = new Class(scene, manager, id);
    cache[id] = component;
    return component;
  }
  /**
   * Wrap a native or js component.
   *
   * @throws For JavaScript components that weren't previously cached,
   * since that would be a bug in the runtime / api.
   *
   * @param manager The manager index.
   * @param id The id to wrap.
   * @returns The previous instance if it was cached, or a new one.
   */
  wrapAny(manager, id) {
    if (id < 0)
      return null;
    if (manager === this.js) {
      const found = this._cache[this.js][id];
      if (!found) {
        throw new Error("JS components must always be cached");
      }
      return found.constructor !== BrokenComponent ? found : null;
    }
    return this.wrapNative(manager, id);
  }
  getNativeManager(name) {
    const manager = this._nativeManagers.get(name);
    return manager !== void 0 ? manager : null;
  }
  /**
   * Perform cleanup upon component destruction.
   *
   * @param instance The instance to destroy.
   *
   * @hidden
   */
  destroy(instance) {
    const localId = instance._localId;
    const manager = instance._manager;
    instance._id = -1;
    instance._localId = -1;
    instance._manager = -1;
    const erasePrototypeOnDestroy = this._scene.engine.erasePrototypeOnDestroy;
    if (erasePrototypeOnDestroy && instance) {
      Object.setPrototypeOf(instance, DestroyedComponentInstance);
    }
    this._cache[manager][localId] = null;
  }
  /** Number of managers, including the JavaScript manager. */
  get managersCount() {
    return this._nativeManagers.size + 1;
  }
};

// node_modules/@wonderlandengine/api/dist/utils/fetch.js
var FetchProgressTransformer = class {
  #progress = 0;
  #callback;
  #totalSize;
  /**
   * Constructor.
   * @param callback Callback that receives the progress.
   * @param totalSize Total size of the data. Pass 0 to indicate that the
   *     size is unknown, then the callback will only be called once after
   *     all data was transferred.
   */
  constructor(callback, totalSize = 0) {
    this.#callback = callback;
    this.#totalSize = totalSize;
  }
  transform(chunk, controller) {
    controller.enqueue(chunk);
    this.#progress += chunk.length;
    if (this.#totalSize > 0) {
      this.#callback(this.#progress, this.#totalSize);
    }
  }
  flush() {
    this.#callback(this.#progress, this.#progress);
  }
};
var ArrayBufferSink = class {
  #buffer;
  #offset = 0;
  /**
   * Constructor.
   * @param size Initial size of the buffer. If less than the received data,
   *     the buffer is dynamically reallocated.
   */
  constructor(size = 0) {
    this.#buffer = new Uint8Array(size);
  }
  /** Get the received data as an {@link ArrayBuffer}. */
  get arrayBuffer() {
    const arrayBuffer = this.#buffer.buffer;
    if (this.#offset < arrayBuffer.byteLength) {
      return arrayBuffer.slice(0, this.#offset);
    }
    return arrayBuffer;
  }
  write(chunk) {
    const newLength = this.#offset + chunk.length;
    if (newLength > this.#buffer.length) {
      const newBuffer = new Uint8Array(Math.max(this.#buffer.length * 1.5, newLength));
      newBuffer.set(this.#buffer);
      this.#buffer = newBuffer;
    }
    this.#buffer.set(chunk, this.#offset);
    this.#offset = newLength;
  }
};
async function fetchWithProgress(path, onProgress, signal) {
  const res = await fetch(path, { signal });
  if (!res.ok)
    throw res.statusText;
  if (!onProgress || !res.body)
    return res.arrayBuffer();
  let size = Number(res.headers.get("Content-Length") ?? 0);
  if (Number.isNaN(size))
    size = 0;
  const sink = new ArrayBufferSink(size);
  await res.body.pipeThrough(new TransformStream(new FetchProgressTransformer(onProgress, size))).pipeTo(new WritableStream(sink));
  return sink.arrayBuffer;
}
function getBaseUrl(url) {
  return url.substring(0, url.lastIndexOf("/"));
}
function getFilename(url) {
  if (url.endsWith("/")) {
    url = url.substring(0, url.lastIndexOf("/"));
  }
  const lastSlash = url.lastIndexOf("/");
  if (lastSlash < 0)
    return url;
  return url.substring(lastSlash + 1);
}
function onImageReady(image) {
  return new Promise((res, rej) => {
    if (image instanceof HTMLCanvasElement) {
      res(image);
    } else if (image instanceof HTMLVideoElement) {
      if (image.readyState >= 2) {
        res(image);
        return;
      }
      image.addEventListener("loadeddata", () => {
        if (image.readyState >= 2)
          res(image);
      }, { once: true });
      return;
    } else if (image.complete) {
      res(image);
      return;
    }
    image.addEventListener("load", () => res(image), { once: true });
    image.addEventListener("error", rej, { once: true });
  });
}

// node_modules/@wonderlandengine/api/dist/prefab.js
var Prefab = class {
  /**
   * Load an `ArrayBuffer` using fetch.
   *
   * @param opts The url or options.
   * @param progress Progress callback
   * @returns An {@link InMemoryLoadOptions} object.
   *
   * @hidden
   */
  static async loadBuffer(options, progress) {
    const opts = isString(options) ? { url: options } : options;
    const buffer = await fetchWithProgress(opts.url, progress, opts.signal);
    const baseURL = getBaseUrl(opts.url);
    const filename = getFilename(opts.url);
    return { ...opts, buffer, baseURL, filename };
  }
  /**
   * Validate the in memory options.
   *
   * @param options Options to validate.
   * @returns Validated options object.
   *
   * @hidden
   */
  static validateBufferOptions(options) {
    const { buffer, baseURL, filename = "scene.bin" } = options;
    if (!buffer) {
      throw new Error("missing 'buffer' in options");
    }
    if (!isString(baseURL)) {
      throw new Error("missing 'baseURL' in options");
    }
    const url = baseURL ? `${baseURL}/${filename}` : filename;
    return { buffer, baseURL, url };
  }
  /** Index in the scene manager. @hidden */
  _index;
  /** @hidden */
  _engine;
  /**
   * Component manager caching to avoid GC.
   *
   * @hidden
   */
  _components;
  /**
   * JavaScript components for this scene.
   *
   * This array is moved into the WASM instance upon activation.
   *
   * @hidden
   */
  _jsComponents = [];
  /** @hidden */
  _animations;
  /** @hidden */
  _skins;
  /**
   * Object class instances to avoid GC.
   *
   * @hidden
   */
  _objectCache = [];
  /**
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  constructor(engine2, index) {
    this._engine = engine2;
    this._index = index;
    this._components = new ComponentManagers(this);
    this._animations = new ResourceManager(this, Animation);
    this._skins = new ResourceManager(this, Skin);
  }
  /**
   * Add an object to the scene.
   *
   * @param parent Parent object or `null`.
   * @returns A newly created object.
   */
  addObject(parent = null) {
    this.assertOrigin(parent);
    const parentId = parent ? parent._id : 0;
    const objectId = this.engine.wasm._wl_scene_add_object(this._index, parentId);
    return this.wrap(objectId);
  }
  /**
   * Batch-add objects to the scene.
   *
   * Will provide better performance for adding multiple objects (e.g. > 16)
   * than calling {@link Scene#addObject} repeatedly in a loop.
   *
   * By providing upfront information of how many objects will be required,
   * the engine is able to batch-allocate the required memory rather than
   * convervatively grow the memory in small steps.
   *
   * @experimental This API might change in upcoming versions.
   *
   * @param count Number of objects to add.
   * @param parent Parent object or `null`, default `null`.
   * @param componentCountHint Hint for how many components in total will
   *      be added to the created objects afterwards, default `0`.
   * @returns Newly created objects
   */
  addObjects(count, parent = null, componentCountHint = 0) {
    const parentId = parent ? parent._id : 0;
    this.engine.wasm.requireTempMem(count * 2);
    const actualCount = this.engine.wasm._wl_scene_add_objects(this._index, parentId, count, componentCountHint || 0, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1);
    const ids = this.engine.wasm._tempMemUint16.subarray(0, actualCount);
    const wrapper = this.wrap.bind(this);
    const objects = Array.from(ids, wrapper);
    return objects;
  }
  /**
   * Pre-allocate memory for a given amount of objects and components.
   *
   * Will provide better performance for adding objects later with {@link Scene#addObject}
   * and {@link Scene#addObjects}.
   *
   * By providing upfront information of how many objects will be required,
   * the engine is able to batch-allocate the required memory rather than
   * conservatively grow the memory in small steps.
   *
   * **Experimental:** This API might change in upcoming versions.
   *
   * @param objectCount Number of objects to add.
   * @param componentCountPerType Amount of components to
   *      allocate for {@link Object3D.addComponent}, e.g. `{mesh: 100, collision: 200, "my-comp": 100}`.
   * @since 0.8.10
   */
  reserveObjects(objectCount, componentCountPerType) {
    const wasm = this.engine.wasm;
    componentCountPerType = componentCountPerType || {};
    const names = Object.keys(componentCountPerType);
    const countsPerTypeIndex = wasm._tempMemInt;
    for (let i = 0; i < this._components.managersCount; ++i) {
      countsPerTypeIndex[i] = 0;
    }
    for (const name of names) {
      const count = componentCountPerType[name];
      const nativeIndex = this._components.getNativeManager(name);
      countsPerTypeIndex[nativeIndex !== null ? nativeIndex : this._components.js] += count;
    }
    wasm._wl_scene_reserve_objects(this._index, objectCount, wasm._tempMem);
  }
  /**
   * Root object's children.
   *
   * See {@link Object3D.getChildren} for more information.
   *
   * @param out Destination array, expected to have at least `this.childrenCount` elements.
   * @returns The `out` parameter.
   */
  getChildren(out = new Array(this.childrenCount)) {
    const root = this.wrap(0);
    return root.getChildren(out);
  }
  /**
   * Top-level objects of this scene.
   *
   * See {@link Object3D.children} for more information.
   *
   * @since 1.2.0
   */
  get children() {
    const root = this.wrap(0);
    return root.children;
  }
  /** The number of children of the root object. */
  get childrenCount() {
    return this.engine.wasm._wl_object_get_children_count(0);
  }
  /**
   * Search for objects matching the name.
   *
   * See {@link Object3D.findByName} for more information.
   *
   * @param name The name to search for.
   * @param recursive If `true`, the method will look at all the objects of
   *     this scene. If `false`, this method will only perform the search in
   *     root objects.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.2.0
   */
  findByName(name, recursive = false) {
    const root = this.wrap(0);
    return root.findByName(name, recursive);
  }
  /**
   * Search for all **top-level** objects matching the name.
   *
   * See {@link Object3D.findByNameDirect} for more information.
   *
   * @param name The name to search for.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.2.0
   */
  findByNameDirect(name) {
    const root = this.wrap(0);
    return root.findByNameDirect(name);
  }
  /**
   * Search for **all objects** matching the name.
   *
   * See {@link Object3D.findByNameRecursive} for more information.
   *
   * @param name The name to search for.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.2.0
   */
  findByNameRecursive(name) {
    const root = this.wrap(0);
    return root.findByNameRecursive(name);
  }
  /**
   * Wrap an object ID using {@link Object}.
   *
   * @note This method performs caching and will return the same
   * instance on subsequent calls.
   *
   * @param objectId ID of the object to create.
   *
   * @returns The object
   */
  wrap(objectId) {
    const cache = this._objectCache;
    const o = cache[objectId] || (cache[objectId] = new Object3D(this, objectId));
    return o;
  }
  /**
   * Destroy the scene.
   *
   * For now, destroying a scene doesn't remove the resources it references. Thus,
   * you will need to reload a main scene to free the memory.
   *
   * For more information about destruction, have a look at the {@link Scene.destroy} method.
   */
  destroy() {
    this.engine._destroyScene(this);
  }
  /* Public Getters & Setters */
  /**
   * `true` if the scene is active, `false` otherwise.
   *
   * Always false for {@link Prefab} and {@link PrefabGLTF}.
   */
  get isActive() {
    return !!this.engine.wasm._wl_scene_active(this._index);
  }
  /**
   * Relative directory of the scene that was loaded.
   *
   * This is used for loading any files relative to the scene.
   */
  get baseURL() {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_scene_get_baseURL(this._index);
    if (!ptr)
      return "";
    return wasm.UTF8ToString(ptr);
  }
  /**
   * Filename used when loading the file.
   *
   * If the scenes was loaded from memory and no filename was provided,
   * this accessor will return an empty string.
   */
  get filename() {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_scene_get_filename(this._index);
    if (!ptr)
      return "";
    return wasm.UTF8ToString(ptr);
  }
  /** Animation resources */
  get animations() {
    return this._animations;
  }
  /** Skin resources */
  get skins() {
    return this._skins;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
  /**
   * `true` if the object is destroyed, `false` otherwise.
   *
   * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
   * reading a class attribute / method will throw.
   */
  get isDestroyed() {
    return this._index < 0;
  }
  toString() {
    if (this.isDestroyed) {
      return "Scene(destroyed)";
    }
    return `Scene('${this.filename}', ${this._index})`;
  }
  /**
   * Checks that the input's scene is the same as this instance.
   *
   * It is forbidden to mix objects and components from different scenes, e.g.,
   *
   * ```js
   * const objA = sceneA.addObject();
   * const objB = sceneA.addObject();
   * objA.parent = objB; // Throws
   * ```
   *
   * @param other Object / component to check.
   *
   * @throws If other's scene isn't the same reference as this.
   */
  assertOrigin(other) {
    if (other && other.scene !== this) {
      throw new Error(`Attempt to use ${other} from ${other.scene} in ${this}`);
    }
  }
  /**
   * Download dependencies and initialize the scene.
   *
   * @hidden
   */
  _initialize() {
    this.engine.wasm._wl_scene_initialize(this._index);
  }
  /**
   * Perform cleanup upon object destruction.
   *
   * @param localId The id to destroy.
   *
   * @hidden
   */
  _destroyObject(localId) {
    const instance = this._objectCache[localId];
    if (!instance)
      return;
    instance._id = -1;
    instance._localId = -1;
    if (this.engine.erasePrototypeOnDestroy && instance) {
      Object.setPrototypeOf(instance, DestroyedObjectInstance);
    }
    this._objectCache[localId] = null;
  }
};

// node_modules/@wonderlandengine/api/dist/utils/misc.js
function clamp(val, min2, max2) {
  return Math.max(Math.min(max2, val), min2);
}
function capitalizeFirstUTF8(str5) {
  return `${str5[0].toUpperCase()}${str5.substring(1)}`;
}
function createDestroyedProxy2(type) {
  return new Proxy({}, {
    get(_, param) {
      if (param === "isDestroyed")
        return true;
      throw new Error(`Cannot read '${param}' of destroyed ${type}`);
    },
    set(_, param) {
      throw new Error(`Cannot write '${param}' of destroyed ${type}`);
    }
  });
}

// node_modules/@wonderlandengine/api/dist/wonderland.js
var __decorate = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LogTag;
(function(LogTag2) {
  LogTag2[LogTag2["Engine"] = 0] = "Engine";
  LogTag2[LogTag2["Scene"] = 1] = "Scene";
  LogTag2[LogTag2["Component"] = 2] = "Component";
})(LogTag || (LogTag = {}));
var Collider;
(function(Collider2) {
  Collider2[Collider2["Sphere"] = 0] = "Sphere";
  Collider2[Collider2["AxisAlignedBox"] = 1] = "AxisAlignedBox";
  Collider2[Collider2["Box"] = 2] = "Box";
})(Collider || (Collider = {}));
var Alignment;
(function(Alignment2) {
  Alignment2[Alignment2["Left"] = 0] = "Left";
  Alignment2[Alignment2["Center"] = 1] = "Center";
  Alignment2[Alignment2["Right"] = 2] = "Right";
})(Alignment || (Alignment = {}));
var VerticalAlignment;
(function(VerticalAlignment2) {
  VerticalAlignment2[VerticalAlignment2["Line"] = 0] = "Line";
  VerticalAlignment2[VerticalAlignment2["Middle"] = 1] = "Middle";
  VerticalAlignment2[VerticalAlignment2["Top"] = 2] = "Top";
  VerticalAlignment2[VerticalAlignment2["Bottom"] = 3] = "Bottom";
})(VerticalAlignment || (VerticalAlignment = {}));
var TextEffect;
(function(TextEffect2) {
  TextEffect2[TextEffect2["None"] = 0] = "None";
  TextEffect2[TextEffect2["Outline"] = 1] = "Outline";
})(TextEffect || (TextEffect = {}));
var TextWrapMode;
(function(TextWrapMode2) {
  TextWrapMode2[TextWrapMode2["None"] = 0] = "None";
  TextWrapMode2[TextWrapMode2["Soft"] = 1] = "Soft";
  TextWrapMode2[TextWrapMode2["Hard"] = 2] = "Hard";
  TextWrapMode2[TextWrapMode2["Clip"] = 3] = "Clip";
})(TextWrapMode || (TextWrapMode = {}));
var InputType;
(function(InputType2) {
  InputType2[InputType2["Head"] = 0] = "Head";
  InputType2[InputType2["EyeLeft"] = 1] = "EyeLeft";
  InputType2[InputType2["EyeRight"] = 2] = "EyeRight";
  InputType2[InputType2["ControllerLeft"] = 3] = "ControllerLeft";
  InputType2[InputType2["ControllerRight"] = 4] = "ControllerRight";
  InputType2[InputType2["RayLeft"] = 5] = "RayLeft";
  InputType2[InputType2["RayRight"] = 6] = "RayRight";
})(InputType || (InputType = {}));
var LightType;
(function(LightType2) {
  LightType2[LightType2["Point"] = 0] = "Point";
  LightType2[LightType2["Spot"] = 1] = "Spot";
  LightType2[LightType2["Sun"] = 2] = "Sun";
})(LightType || (LightType = {}));
var AnimationState;
(function(AnimationState2) {
  AnimationState2[AnimationState2["Playing"] = 0] = "Playing";
  AnimationState2[AnimationState2["Paused"] = 1] = "Paused";
  AnimationState2[AnimationState2["Stopped"] = 2] = "Stopped";
})(AnimationState || (AnimationState = {}));
var ForceMode;
(function(ForceMode2) {
  ForceMode2[ForceMode2["Force"] = 0] = "Force";
  ForceMode2[ForceMode2["Impulse"] = 1] = "Impulse";
  ForceMode2[ForceMode2["VelocityChange"] = 2] = "VelocityChange";
  ForceMode2[ForceMode2["Acceleration"] = 3] = "Acceleration";
})(ForceMode || (ForceMode = {}));
var CollisionEventType;
(function(CollisionEventType2) {
  CollisionEventType2[CollisionEventType2["Touch"] = 0] = "Touch";
  CollisionEventType2[CollisionEventType2["TouchLost"] = 1] = "TouchLost";
  CollisionEventType2[CollisionEventType2["TriggerTouch"] = 2] = "TriggerTouch";
  CollisionEventType2[CollisionEventType2["TriggerTouchLost"] = 3] = "TriggerTouchLost";
})(CollisionEventType || (CollisionEventType = {}));
var Shape;
(function(Shape2) {
  Shape2[Shape2["None"] = 0] = "None";
  Shape2[Shape2["Sphere"] = 1] = "Sphere";
  Shape2[Shape2["Capsule"] = 2] = "Capsule";
  Shape2[Shape2["Box"] = 3] = "Box";
  Shape2[Shape2["Plane"] = 4] = "Plane";
  Shape2[Shape2["ConvexMesh"] = 5] = "ConvexMesh";
  Shape2[Shape2["TriangleMesh"] = 6] = "TriangleMesh";
})(Shape || (Shape = {}));
var MeshAttribute;
(function(MeshAttribute2) {
  MeshAttribute2[MeshAttribute2["Position"] = 0] = "Position";
  MeshAttribute2[MeshAttribute2["Tangent"] = 1] = "Tangent";
  MeshAttribute2[MeshAttribute2["Normal"] = 2] = "Normal";
  MeshAttribute2[MeshAttribute2["TextureCoordinate"] = 3] = "TextureCoordinate";
  MeshAttribute2[MeshAttribute2["Color"] = 4] = "Color";
  MeshAttribute2[MeshAttribute2["JointId"] = 5] = "JointId";
  MeshAttribute2[MeshAttribute2["JointWeight"] = 6] = "JointWeight";
})(MeshAttribute || (MeshAttribute = {}));
var DestroyedObjectInstance = createDestroyedProxy2("object");
var DestroyedComponentInstance = createDestroyedProxy2("component");
var DestroyedPrefabInstance = createDestroyedProxy2("prefab/scene");
function isMeshShape(shape) {
  return shape === Shape.ConvexMesh || shape === Shape.TriangleMesh;
}
function isBaseComponentClass(value) {
  return !!value && value.hasOwnProperty("_isBaseComponent") && value._isBaseComponent;
}
var UP_VECTOR = [0, 1, 0];
var SQRT_3 = Math.sqrt(3);
var _Component = class {
  /**
   * Pack scene index and component id.
   *
   * @param scene Scene index.
   * @param id Component id.
   * @returns The packed id.
   *
   * @hidden
   */
  static _pack(scene, id) {
    return scene << 22 | id;
  }
  /**
   * Allows to inherit properties directly inside the editor.
   *
   * @note Do not use directly, prefer using {@link inheritProperties}.
   *
   * @hidden
   */
  static _inheritProperties() {
    inheritProperties(this);
  }
  /** Manager index. @hidden */
  _manager;
  /** Packed id, containing the scene and the local id. @hidden */
  _id;
  /** Id relative to the scene component's manager. @hidden */
  _localId;
  /**
   * Object containing this object.
   *
   * **Note**: This is cached for faster retrieval.
   *
   * @hidden
   */
  _object;
  /** Scene instance. @hidden */
  _scene;
  /**
   * Create a new instance
   *
   * @param engine The engine instance.
   * @param manager Index of the manager.
   * @param id WASM component instance index.
   *
   * @hidden
   */
  constructor(scene, manager = -1, id = -1) {
    this._scene = scene;
    this._manager = manager;
    this._localId = id;
    this._id = _Component._pack(scene._index, id);
    this._object = null;
  }
  /** Scene this component is part of. */
  get scene() {
    return this._scene;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._scene.engine;
  }
  /** The name of this component's type */
  get type() {
    const ctor = this.constructor;
    return ctor.TypeName;
  }
  /** The object this component is attached to. */
  get object() {
    if (!this._object) {
      const objectId = this.engine.wasm._wl_component_get_object(this._manager, this._id);
      this._object = this._scene.wrap(objectId);
    }
    return this._object;
  }
  /**
   * Set whether this component is active.
   *
   * Activating/deactivating a component comes at a small cost of reordering
   * components in the respective component manager. This function therefore
   * is not a trivial assignment.
   *
   * Does nothing if the component is already activated/deactivated.
   *
   * @param active New active state.
   */
  set active(active) {
    this.engine.wasm._wl_component_setActive(this._manager, this._id, active);
  }
  /** `true` if the component is marked as active and its scene is active. */
  get active() {
    return this.markedActive && this._scene.isActive;
  }
  /**
   * `true` if the component is marked as active in the scene, `false` otherwise.
   *
   * @note At the opposite of {@link Component.active}, this accessor doesn't
   * take into account whether the scene is active or not.
   */
  get markedActive() {
    return this.engine.wasm._wl_component_isActive(this._manager, this._id) != 0;
  }
  /**
   * Copy all the properties from `src` into this instance.
   *
   * @note Only properties are copied. If a component needs to
   * copy extra data, it needs to override this method.
   *
   * #### Example
   *
   * ```js
   * class MyComponent extends Component {
   *     nonPropertyData = 'Hello World';
   *
   *     copy(src) {
   *         super.copy(src);
   *         this.nonPropertyData = src.nonPropertyData;
   *         return this;
   *     }
   * }
   * ```
   *
   * @note This method is called by {@link Object3D.clone}. Do not attempt to:
   *     - Create new component
   *     - Read references to other objects
   *
   * When cloning via {@link Object3D.clone}, this method will be called before
   * {@link Component.start}.
   *
   * @note JavaScript component properties aren't retargeted. Thus, references
   * inside the source object will not be retargeted to the destination object,
   * at the exception of the skin data on {@link MeshComponent} and {@link AnimationComponent}.
   *
   * @param src The source component to copy from.
   *
   * @returns Reference to self (for method chaining).
   */
  copy(src) {
    const ctor = this.constructor;
    const properties = ctor.Properties;
    if (!properties)
      return this;
    for (const name in properties) {
      const property2 = properties[name];
      const value = src[name];
      if (value === void 0)
        continue;
      const cloner = property2.cloner ?? defaultPropertyCloner;
      this[name] = cloner.clone(property2.type, value);
    }
    return this;
  }
  /**
   * Remove this component from its objects and destroy it.
   *
   * It is best practice to set the component to `null` after,
   * to ensure it does not get used later.
   *
   * ```js
   *    c.destroy();
   *    c = null;
   * ```
   * @since 0.9.0
   */
  destroy() {
    const manager = this._manager;
    if (manager < 0 || this._id < 0)
      return;
    this.engine.wasm._wl_component_remove(manager, this._id);
  }
  /**
   * Checks equality by comparing ids and **not** the JavaScript reference.
   *
   * @deprecate Use JavaScript reference comparison instead:
   *
   * ```js
   * const componentA = obj.addComponent('mesh');
   * const componentB = obj.addComponent('mesh');
   * const componentC = componentB;
   * console.log(componentA === componentB); // false
   * console.log(componentA === componentA); // true
   * console.log(componentB === componentC); // true
   * ```
   */
  equals(otherComponent) {
    if (!otherComponent)
      return false;
    return this._manager === otherComponent._manager && this._id === otherComponent._id;
  }
  /**
   * Reset the component properties to default.
   *
   * @note This is automatically called during the component instantiation.
   *
   * @returns Reference to self (for method chaining).
   */
  resetProperties() {
    const ctor = this.constructor;
    const properties = ctor.Properties;
    if (!properties)
      return this;
    for (const name in properties) {
      const property2 = properties[name];
      const cloner = property2.cloner ?? defaultPropertyCloner;
      this[name] = cloner.clone(property2.type, property2.default);
    }
    return this;
  }
  /** @deprecated Use {@link Component.resetProperties} instead. */
  reset() {
    return this.resetProperties();
  }
  /**
   * Validate the properties on this instance.
   *
   * @throws If any of the required properties isn't initialized
   * on this instance.
   */
  validateProperties() {
    const ctor = this.constructor;
    if (!ctor.Properties)
      return;
    for (const name in ctor.Properties) {
      if (!ctor.Properties[name].required)
        continue;
      if (!this[name]) {
        throw new Error(`Property '${name}' is required but was not initialized`);
      }
    }
  }
  toString() {
    if (this.isDestroyed) {
      return "Component(destroyed)";
    }
    return `Component('${this.type}', ${this._localId})`;
  }
  /**
   * `true` if the component is destroyed, `false` otherwise.
   *
   * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
   * reading a custom property will not work:
   *
   * ```js
   * engine.erasePrototypeOnDestroy = true;
   *
   * const comp = obj.addComponent('mesh');
   * comp.customParam = 'Hello World!';
   *
   * console.log(comp.isDestroyed); // Prints `false`
   * comp.destroy();
   * console.log(comp.isDestroyed); // Prints `true`
   * console.log(comp.customParam); // Throws an error
   * ```
   *
   * @since 1.1.1
   */
  get isDestroyed() {
    return this._id < 0;
  }
  /** @hidden */
  _copy(src, offsetsPtr) {
    const wasm = this.engine.wasm;
    const offsets = wasm.HEAPU32;
    const offsetsStart = offsetsPtr >>> 2;
    const destScene = this._scene;
    const ctor = this.constructor;
    for (const name in ctor.Properties) {
      const value = src[name];
      if (value === null) {
        this[name] = null;
        continue;
      }
      const prop = ctor.Properties[name];
      const offset2 = offsets[offsetsStart + prop.type];
      let retargeted;
      switch (prop.type) {
        case Type.Object: {
          const index = wasm._wl_object_index(value._id);
          const id = wasm._wl_object_id(destScene._index, index + offset2);
          retargeted = destScene.wrap(id);
          break;
        }
        case Type.Animation:
          retargeted = destScene.animations.wrap(offset2 + value._index);
          break;
        case Type.Skin:
          retargeted = destScene.skins.wrap(offset2 + value._index);
          break;
        default:
          const cloner = prop.cloner ?? defaultPropertyCloner;
          retargeted = cloner.clone(prop.type, value);
          break;
      }
      this[name] = retargeted;
    }
    return this;
  }
  /**
   * Trigger the component {@link Component.init} method.
   *
   * @note Use this method instead of directly calling {@link Component.init},
   * because this method creates an handler for the {@link Component.start}.
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _triggerInit() {
    if (this.init) {
      try {
        this.init();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} init() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
      }
    }
    const oldActivate = this.onActivate;
    this.onActivate = function() {
      this.onActivate = oldActivate;
      let failed = false;
      try {
        this.validateProperties();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} validateProperties() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
        failed = true;
      }
      try {
        this.start?.();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} start() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
        failed = true;
      }
      if (failed) {
        this.active = false;
        return;
      }
      if (!this.onActivate)
        return;
      try {
        this.onActivate();
      } catch (e) {
        this.engine.log.error(LogTag.Component, `Exception during ${this.type} onActivate() on object ${this.object.name}`);
        this.engine.log.error(LogTag.Component, e);
      }
    };
  }
  /**
   * Trigger the component {@link Component.update} method.
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _triggerUpdate(dt) {
    if (!this.update)
      return;
    try {
      this.update(dt);
    } catch (e) {
      this.engine.log.error(LogTag.Component, `Exception during ${this.type} update() on object ${this.object.name}`);
      this.engine.log.error(LogTag.Component, e);
      if (this.engine.wasm._deactivate_component_on_error) {
        this.active = false;
      }
    }
  }
  /**
   * Trigger the component {@link Component.onActivate} method.
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _triggerOnActivate() {
    if (!this.onActivate)
      return;
    try {
      this.onActivate();
    } catch (e) {
      this.engine.log.error(LogTag.Component, `Exception during ${this.type} onActivate() on object ${this.object.name}`);
      this.engine.log.error(LogTag.Component, e);
    }
  }
  /**
   * Trigger the component {@link Component.onDeactivate} method.
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _triggerOnDeactivate() {
    if (!this.onDeactivate)
      return;
    try {
      this.onDeactivate();
    } catch (e) {
      this.engine.log.error(LogTag.Component, `Exception during ${this.type} onDeactivate() on object ${this.object.name}`);
      this.engine.log.error(LogTag.Component, e);
    }
  }
  /**
   * Trigger the component {@link Component.onDestroy} method.
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _triggerOnDestroy() {
    try {
      if (this.onDestroy)
        this.onDestroy();
    } catch (e) {
      this.engine.log.error(LogTag.Component, `Exception during ${this.type} onDestroy() on object ${this.object.name}`);
      this.engine.log.error(LogTag.Component, e);
    }
    this._scene._components.destroy(this);
  }
};
var Component = _Component;
/**
 * `true` for every class inheriting from this class.
 *
 * @note This is a workaround for `instanceof` to prevent issues
 * that could arise when an application ends up using multiple API versions.
 *
 * @hidden
 */
__publicField(Component, "_isBaseComponent", true);
/**
 * Fixed order of attributes in the `Properties` array.
 *
 * @note This is used for parameter deserialization and is filled during
 * component registration.
 *
 * @hidden
 */
__publicField(Component, "_propertyOrder", []);
/**
 * Unique identifier for this component class.
 *
 * This is used to register, add, and retrieve components of a given type.
 */
__publicField(Component, "TypeName");
/**
 * Properties of this component class.
 *
 * Properties are public attributes that can be configured via the
 * Wonderland Editor.
 *
 * Example:
 *
 * ```js
 * import { Component, Type } from '@wonderlandengine/api';
 * class MyComponent extends Component {
 *     static TypeName = 'my-component';
 *     static Properties = {
 *         myBoolean: { type: Type.Boolean, default: false },
 *         myFloat: { type: Type.Float, default: false },
 *         myTexture: { type: Type.Texture, default: null },
 *     };
 * }
 * ```
 *
 * Properties are automatically added to each component instance, and are
 * accessible like any JS attribute:
 *
 * ```js
 * // Creates a new component and set each properties value:
 * const myComponent = object.addComponent(MyComponent, {
 *     myBoolean: true,
 *     myFloat: 42.0,
 *     myTexture: null
 * });
 *
 * // You can also override the properties on the instance:
 * myComponent.myBoolean = false;
 * myComponent.myFloat = -42.0;
 * ```
 *
 * #### References
 *
 * Reference types (i.e., mesh, object, etc...) can also be listed as **required**:
 *
 * ```js
 * import {Component, Property} from '@wonderlandengine/api';
 *
 * class MyComponent extends Component {
 *     static Properties = {
 *         myObject: Property.object({required: true}),
 *         myAnimation: Property.animation({required: true}),
 *         myTexture: Property.texture({required: true}),
 *         myMesh: Property.mesh({required: true}),
 *     }
 * }
 * ```
 *
 * Please note that references are validated **once** before the call to {@link Component.start} only,
 * via the {@link Component.validateProperties} method.
 */
__publicField(Component, "Properties");
/**
 * When set to `true`, the child class inherits from the parent
 * properties, as shown in the following example:
 *
 * ```js
 * import {Component, Property} from '@wonderlandengine/api';
 *
 * class Parent extends Component {
 *     static TypeName = 'parent';
 *     static Properties = {parentName: Property.string('parent')}
 * }
 *
 * class Child extends Parent {
 *     static TypeName = 'child';
 *     static Properties = {name: Property.string('child')}
 *     static InheritProperties = true;
 *
 *     start() {
 *         // Works because `InheritProperties` is `true`.
 *         console.log(`${this.name} inherits from ${this.parentName}`);
 *     }
 * }
 * ```
 *
 * @note Properties defined in descendant classes will override properties
 * with the same name defined in ancestor classes.
 *
 * Defaults to `true`.
 */
__publicField(Component, "InheritProperties");
/**
 * Called when this component class is registered.
 *
 * @example
 *
 * This callback can be used to register dependencies of a component,
 * e.g., component classes that need to be registered in order to add
 * them at runtime with {@link Object3D.addComponent}, independent of whether
 * they are used in the editor.
 *
 * ```js
 * class Spawner extends Component {
 *     static TypeName = 'spawner';
 *
 *     static onRegister(engine) {
 *         engine.registerComponent(SpawnedComponent);
 *     }
 *
 *     // You can now use addComponent with SpawnedComponent
 * }
 * ```
 *
 * @example
 *
 * This callback can be used to register different implementations of a
 * component depending on client features or API versions.
 *
 * ```js
 * // Properties need to be the same for all implementations!
 * const SharedProperties = {};
 *
 * class Anchor extends Component {
 *     static TypeName = 'spawner';
 *     static Properties = SharedProperties;
 *
 *     static onRegister(engine) {
 *         if(navigator.xr === undefined) {
 *             /* WebXR unsupported, keep this dummy component *\/
 *             return;
 *         }
 *         /* WebXR supported! Override already registered dummy implementation
 *          * with one depending on hit-test API support *\/
 *         engine.registerComponent(window.HitTestSource === undefined ?
 *             AnchorWithoutHitTest : AnchorWithHitTest);
 *     }
 *
 *     // This one implements no functions
 * }
 * ```
 */
__publicField(Component, "onRegister");
var BrokenComponent = class extends Component {
};
__publicField(BrokenComponent, "TypeName", "__broken-component__");
function inheritProperties(target) {
  if (!target.TypeName)
    return;
  const chain = [];
  let curr = target;
  while (curr && !isBaseComponentClass(curr)) {
    const comp = curr;
    const needsMerge = comp.hasOwnProperty("InheritProperties") ? comp.InheritProperties : true;
    if (!needsMerge)
      break;
    if (comp.TypeName && comp.hasOwnProperty("Properties")) {
      chain.push(comp);
    }
    curr = Object.getPrototypeOf(curr);
  }
  if (!chain.length || chain.length === 1 && chain[0] === target) {
    return;
  }
  const merged = {};
  for (let i = chain.length - 1; i >= 0; --i) {
    Object.assign(merged, chain[i].Properties);
  }
  target.Properties = merged;
}
var CollisionComponent = class extends Component {
  getExtents(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    return out;
  }
  /** Collision component collider */
  get collider() {
    return this.engine.wasm._wl_collision_component_get_collider(this._id);
  }
  /**
   * Set collision component collider.
   *
   * @param collider Collider of the collision component.
   */
  set collider(collider) {
    this.engine.wasm._wl_collision_component_set_collider(this._id, collider);
  }
  /**
   * Equivalent to {@link CollisionComponent.getExtents}.
   *
   * @note Prefer to use {@link CollisionComponent.getExtents} for performance.
   */
  get extents() {
    const wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
  }
  /**
   * Set collision component extents.
   *
   * If {@link collider} returns {@link Collider.Sphere}, only the first
   * component of the passed vector is used.
   *
   * Example:
   *
   * ```js
   * // Spans 1 unit on the x-axis, 2 on the y-axis, 3 on the z-axis.
   * collision.extent = [1, 2, 3];
   * ```
   *
   * @param extents Extents of the collision component, expects a
   *      3 component array.
   */
  set extents(extents) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_collision_component_get_extents(this._id) / 4;
    wasm.HEAPF32[ptr] = extents[0];
    wasm.HEAPF32[ptr + 1] = extents[1];
    wasm.HEAPF32[ptr + 2] = extents[2];
  }
  /**
   * Get collision component radius.
   *
   * @note If {@link collider} is not {@link Collider.Sphere}, the returned value
   * corresponds to the radius of a sphere enclosing the shape.
   *
   * Example:
   *
   * ```js
   * sphere.radius = 3.0;
   * console.log(sphere.radius); // 3.0
   *
   * box.extents = [2.0, 2.0, 2.0];
   * console.log(box.radius); // 1.732...
   * ```
   *
   */
  get radius() {
    const wasm = this.engine.wasm;
    if (this.collider === Collider.Sphere)
      return wasm.HEAPF32[wasm._wl_collision_component_get_extents(this._id) >> 2];
    const extents = new Float32Array(wasm.HEAPF32.buffer, wasm._wl_collision_component_get_extents(this._id), 3);
    const x2 = extents[0] * extents[0];
    const y2 = extents[1] * extents[1];
    const z2 = extents[2] * extents[2];
    return Math.sqrt(x2 + y2 + z2) / 2;
  }
  /**
   * Set collision component radius.
   *
   * @param radius Radius of the collision component
   *
   * @note If {@link collider} is not {@link Collider.Sphere},
   * the extents are set to form a square that fits a sphere with the provided radius.
   *
   * Example:
   *
   * ```js
   * aabbCollision.radius = 2.0; // AABB fits a sphere of radius 2.0
   * boxCollision.radius = 3.0; // Box now fits a sphere of radius 3.0, keeping orientation
   * ```
   *
   */
  set radius(radius) {
    const length5 = this.collider === Collider.Sphere ? radius : 2 * radius / SQRT_3;
    this.extents.set([length5, length5, length5]);
  }
  /**
   * Collision component group.
   *
   * The groups is a bitmask that is compared to other components in {@link CollisionComponent#queryOverlaps}
   * or the group in {@link Scene#rayCast}.
   *
   * Colliders that have no common groups will not overlap with each other. If a collider
   * has none of the groups set for {@link Scene#rayCast}, the ray will not hit it.
   *
   * Each bit represents belonging to a group, see example.
   *
   * ```js
   *    // c belongs to group 2
   *    c.group = (1 << 2);
   *
   *    // c belongs to group 0
   *    c.group = (1 << 0);
   *
   *    // c belongs to group 0 *and* 2
   *    c.group = (1 << 0) | (1 << 2);
   *
   *    (c.group & (1 << 2)) != 0; // true
   *    (c.group & (1 << 7)) != 0; // false
   * ```
   */
  get group() {
    return this.engine.wasm._wl_collision_component_get_group(this._id);
  }
  /**
   * Set collision component group.
   *
   * @param group Group mask of the collision component.
   */
  set group(group) {
    this.engine.wasm._wl_collision_component_set_group(this._id, group);
  }
  /**
   * Query overlapping objects.
   *
   * Usage:
   *
   * ```js
   * const collision = object.getComponent('collision');
   * const overlaps = collision.queryOverlaps();
   * for(const otherCollision of overlaps) {
   *     const otherObject = otherCollision.object;
   *     console.log(`Collision with object ${otherObject.objectId}`);
   * }
   * ```
   *
   * @returns Collision components overlapping this collider.
   */
  queryOverlaps() {
    const count = this.engine.wasm._wl_collision_component_query_overlaps(this._id, this.engine.wasm._tempMem, this.engine.wasm._tempMemSize >> 1);
    const overlaps = new Array(count);
    for (let i = 0; i < count; ++i) {
      const id = this.engine.wasm._tempMemUint16[i];
      overlaps[i] = this._scene._components.wrapCollision(id);
    }
    return overlaps;
  }
};
/** @override */
__publicField(CollisionComponent, "TypeName", "collision");
__decorate([
  nativeProperty()
], CollisionComponent.prototype, "collider", null);
__decorate([
  nativeProperty()
], CollisionComponent.prototype, "extents", null);
__decorate([
  nativeProperty()
], CollisionComponent.prototype, "group", null);
var TextComponent = class extends Component {
  /** Text component alignment. */
  get alignment() {
    return this.engine.wasm._wl_text_component_get_horizontal_alignment(this._id);
  }
  /**
   * Set text component alignment.
   *
   * @param alignment Alignment for the text component.
   */
  set alignment(alignment) {
    this.engine.wasm._wl_text_component_set_horizontal_alignment(this._id, alignment);
  }
  /**
   * Text component vertical alignment.
   * @since 1.2.0
   */
  get verticalAlignment() {
    return this.engine.wasm._wl_text_component_get_vertical_alignment(this._id);
  }
  /**
   * Set text component vertical alignment.
   *
   * @param verticalAlignment Vertical for the text component.
   * @since 1.2.0
   */
  set verticalAlignment(verticalAlignment) {
    this.engine.wasm._wl_text_component_set_vertical_alignment(this._id, verticalAlignment);
  }
  /**
   * Text component justification.
   *
   * @deprecated Please use {@link TextComponent.verticalAlignment} instead.
   */
  get justification() {
    return this.verticalAlignment;
  }
  /**
   * Set text component justification.
   *
   * @param justification Justification for the text component.
   *
   * @deprecated Please use {@link TextComponent.verticalAlignment} instead.
   */
  set justification(justification) {
    this.verticalAlignment = justification;
  }
  /** Text component character spacing. */
  get characterSpacing() {
    return this.engine.wasm._wl_text_component_get_character_spacing(this._id);
  }
  /**
   * Set text component character spacing.
   *
   * @param spacing Character spacing for the text component.
   */
  set characterSpacing(spacing) {
    this.engine.wasm._wl_text_component_set_character_spacing(this._id, spacing);
  }
  /** Text component line spacing. */
  get lineSpacing() {
    return this.engine.wasm._wl_text_component_get_line_spacing(this._id);
  }
  /**
   * Set text component line spacing
   *
   * @param spacing Line spacing for the text component
   */
  set lineSpacing(spacing) {
    this.engine.wasm._wl_text_component_set_line_spacing(this._id, spacing);
  }
  /** Text component effect. */
  get effect() {
    return this.engine.wasm._wl_text_component_get_effect(this._id);
  }
  /**
   * Set text component effect
   *
   * @param effect Effect for the text component
   */
  set effect(effect) {
    this.engine.wasm._wl_text_component_set_effect(this._id, effect);
  }
  /**
   * Text component line wrap mode.
   * @since 1.2.1
   */
  get wrapMode() {
    return this.engine.wasm._wl_text_component_get_wrapMode(this._id);
  }
  /**
   * Set text component line wrap mode.
   *
   * @param wrapMode Line wrap mode for the text component.
   * @since 1.2.1
   */
  set wrapMode(wrapMode) {
    this.engine.wasm._wl_text_component_set_wrapMode(this._id, wrapMode);
  }
  /**
   * Text component line wrap width.
   * @since 1.2.1
   */
  get wrapWidth() {
    return this.engine.wasm._wl_text_component_get_wrapWidth(this._id);
  }
  /**
   * Set text component line wrap width.
   *
   * Only takes effect when {@link wrapMode} is something other than
   * {@link TextWrapMode.None}.
   *
   * @param width Line wrap width for the text component.
   * @since 1.2.1
   */
  set wrapWidth(width) {
    this.engine.wasm._wl_text_component_set_wrapWidth(this._id, width);
  }
  /** Text component text. */
  get text() {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_text_component_get_text(this._id);
    return wasm.UTF8ToString(ptr);
  }
  /**
   * Set text component text.
   *
   * @param text Text of the text component.
   */
  set text(text) {
    const wasm = this.engine.wasm;
    wasm._wl_text_component_set_text(this._id, wasm.tempUTF8(text.toString()));
  }
  /**
   * Set material to render the text with.
   *
   * @param material New material.
   */
  set material(material) {
    const matIndex = material ? material._id : 0;
    this.engine.wasm._wl_text_component_set_material(this._id, matIndex);
  }
  /** Material used to render the text. */
  get material() {
    const index = this.engine.wasm._wl_text_component_get_material(this._id);
    return this.engine.materials.wrap(index);
  }
  /** @overload */
  getBoundingBoxForText(text, out = new Float32Array(4)) {
    const wasm = this.engine.wasm;
    const textPtr = wasm.tempUTF8(text, 4 * 4);
    this.engine.wasm._wl_text_component_get_boundingBox(this._id, textPtr, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    out[3] = wasm._tempMemFloat[3];
    return out;
  }
  /** @overload */
  getBoundingBox(out = new Float32Array(4)) {
    const wasm = this.engine.wasm;
    this.engine.wasm._wl_text_component_get_boundingBox(this._id, 0, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    out[3] = wasm._tempMemFloat[3];
    return out;
  }
};
/** @override */
__publicField(TextComponent, "TypeName", "text");
__decorate([
  nativeProperty()
], TextComponent.prototype, "alignment", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "verticalAlignment", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "justification", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "characterSpacing", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "lineSpacing", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "effect", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "wrapMode", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "wrapWidth", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "text", null);
__decorate([
  nativeProperty()
], TextComponent.prototype, "material", null);
var ViewComponent = class extends Component {
  getProjectionMatrix(out = new Float32Array(16)) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_view_component_get_projection_matrix(this._id) / 4;
    for (let i = 0; i < 16; ++i) {
      out[i] = wasm.HEAPF32[ptr + i];
    }
    return out;
  }
  /**
   * Equivalent to {@link ViewComponent.getProjectionMatrix}.
   *
   * @note Prefer to use {@link ViewComponent.getProjectionMatrix} for performance.
   */
  get projectionMatrix() {
    const wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_view_component_get_projection_matrix(this._id), 16);
  }
  /** ViewComponent near clipping plane value. */
  get near() {
    return this.engine.wasm._wl_view_component_get_near(this._id);
  }
  /**
   * Set near clipping plane distance for the view.
   *
   * If an XR session is active, the change will apply in the
   * following frame, otherwise the change is immediate.
   *
   * @param near Near depth value.
   */
  set near(near) {
    this.engine.wasm._wl_view_component_set_near(this._id, near);
  }
  /** Far clipping plane value. */
  get far() {
    return this.engine.wasm._wl_view_component_get_far(this._id);
  }
  /**
   * Set far clipping plane distance for the view.
   *
   * If an XR session is active, the change will apply in the
   * following frame, otherwise the change is immediate.
   *
   * @param far Near depth value.
   */
  set far(far) {
    this.engine.wasm._wl_view_component_set_far(this._id, far);
  }
  /**
   * Get the horizontal field of view for the view, **in degrees**.
   *
   * If an XR session is active, this returns the field of view reported by
   * the device, regardless of the fov that was set.
   */
  get fov() {
    return this.engine.wasm._wl_view_component_get_fov(this._id);
  }
  /**
   * Set the horizontal field of view for the view, **in degrees**.
   *
   * If an XR session is active, the field of view reported by the device is
   * used and this value is ignored. After the XR session ends, the new value
   * is applied.
   *
   * @param fov Horizontal field of view, **in degrees**.
   */
  set fov(fov) {
    this.engine.wasm._wl_view_component_set_fov(this._id, fov);
  }
};
/** @override */
__publicField(ViewComponent, "TypeName", "view");
__decorate([
  enumerable()
], ViewComponent.prototype, "projectionMatrix", null);
__decorate([
  nativeProperty()
], ViewComponent.prototype, "near", null);
__decorate([
  nativeProperty()
], ViewComponent.prototype, "far", null);
__decorate([
  nativeProperty()
], ViewComponent.prototype, "fov", null);
var InputComponent = class extends Component {
  /** Input component type */
  get inputType() {
    return this.engine.wasm._wl_input_component_get_type(this._id);
  }
  /**
   * Set input component type.
   *
   * @params New input component type.
   */
  set inputType(type) {
    this.engine.wasm._wl_input_component_set_type(this._id, type);
  }
  /**
   * WebXR Device API input source associated with this input component,
   * if type {@link InputType.ControllerLeft} or {@link InputType.ControllerRight}.
   */
  get xrInputSource() {
    const xr = this.engine.xr;
    if (!xr)
      return null;
    for (let inputSource of xr.session.inputSources) {
      if (inputSource.handedness == this.handedness) {
        return inputSource;
      }
    }
    return null;
  }
  /**
   * 'left', 'right' or `null` depending on the {@link InputComponent#inputType}.
   */
  get handedness() {
    const inputType = this.inputType;
    if (inputType == InputType.ControllerRight || inputType == InputType.RayRight || inputType == InputType.EyeRight)
      return "right";
    if (inputType == InputType.ControllerLeft || inputType == InputType.RayLeft || inputType == InputType.EyeLeft)
      return "left";
    return null;
  }
};
/** @override */
__publicField(InputComponent, "TypeName", "input");
__decorate([
  nativeProperty()
], InputComponent.prototype, "inputType", null);
__decorate([
  enumerable()
], InputComponent.prototype, "xrInputSource", null);
__decorate([
  enumerable()
], InputComponent.prototype, "handedness", null);
var LightComponent = class extends Component {
  getColor(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_light_component_get_color(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    return out;
  }
  /**
   * Set light color.
   *
   * @param c New color array/vector, expected to have at least 3 elements.
   * @since 1.0.0
   */
  setColor(c) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_light_component_get_color(this._id) / 4;
    wasm.HEAPF32[ptr] = c[0];
    wasm.HEAPF32[ptr + 1] = c[1];
    wasm.HEAPF32[ptr + 2] = c[2];
  }
  /**
   * View on the light color.
   *
   * @note Prefer to use {@link getColor} in performance-critical code.
   */
  get color() {
    const wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_light_component_get_color(this._id), 3);
  }
  /**
   * Set light color.
   *
   * @param c Color of the light component.
   *
   * @note Prefer to use {@link setColor} in performance-critical code.
   */
  set color(c) {
    this.color.set(c);
  }
  /** Light type. */
  get lightType() {
    return this.engine.wasm._wl_light_component_get_type(this._id);
  }
  /**
   * Set light type.
   *
   * @param lightType Type of the light component.
   */
  set lightType(t) {
    this.engine.wasm._wl_light_component_set_type(this._id, t);
  }
  /**
   * Light intensity.
   * @since 1.0.0
   */
  get intensity() {
    return this.engine.wasm._wl_light_component_get_intensity(this._id);
  }
  /**
   * Set light intensity.
   *
   * @param intensity Intensity of the light component.
   * @since 1.0.0
   */
  set intensity(intensity) {
    this.engine.wasm._wl_light_component_set_intensity(this._id, intensity);
  }
  /**
   * Outer angle for spot lights, in degrees.
   * @since 1.0.0
   */
  get outerAngle() {
    return this.engine.wasm._wl_light_component_get_outerAngle(this._id);
  }
  /**
   * Set outer angle for spot lights.
   *
   * @param angle Outer angle, in degrees.
   * @since 1.0.0
   */
  set outerAngle(angle2) {
    this.engine.wasm._wl_light_component_set_outerAngle(this._id, angle2);
  }
  /**
   * Inner angle for spot lights, in degrees.
   * @since 1.0.0
   */
  get innerAngle() {
    return this.engine.wasm._wl_light_component_get_innerAngle(this._id);
  }
  /**
   * Set inner angle for spot lights.
   *
   * @param angle Inner angle, in degrees.
   * @since 1.0.0
   */
  set innerAngle(angle2) {
    this.engine.wasm._wl_light_component_set_innerAngle(this._id, angle2);
  }
  /**
   * Whether the light casts shadows.
   * @since 1.0.0
   */
  get shadows() {
    return !!this.engine.wasm._wl_light_component_get_shadows(this._id);
  }
  /**
   * Set whether the light casts shadows.
   *
   * @param b Whether the light casts shadows.
   * @since 1.0.0
   */
  set shadows(b) {
    this.engine.wasm._wl_light_component_set_shadows(this._id, b);
  }
  /**
   * Range for shadows.
   * @since 1.0.0
   */
  get shadowRange() {
    return this.engine.wasm._wl_light_component_get_shadowRange(this._id);
  }
  /**
   * Set range for shadows.
   *
   * @param range Range for shadows.
   * @since 1.0.0
   */
  set shadowRange(range) {
    this.engine.wasm._wl_light_component_set_shadowRange(this._id, range);
  }
  /**
   * Bias value for shadows.
   * @since 1.0.0
   */
  get shadowBias() {
    return this.engine.wasm._wl_light_component_get_shadowBias(this._id);
  }
  /**
   * Set bias value for shadows.
   *
   * @param bias Bias for shadows.
   * @since 1.0.0
   */
  set shadowBias(bias) {
    this.engine.wasm._wl_light_component_set_shadowBias(this._id, bias);
  }
  /**
   * Normal bias value for shadows.
   * @since 1.0.0
   */
  get shadowNormalBias() {
    return this.engine.wasm._wl_light_component_get_shadowNormalBias(this._id);
  }
  /**
   * Set normal bias value for shadows.
   *
   * @param bias Normal bias for shadows.
   * @since 1.0.0
   */
  set shadowNormalBias(bias) {
    this.engine.wasm._wl_light_component_set_shadowNormalBias(this._id, bias);
  }
  /**
   * Texel size for shadows.
   * @since 1.0.0
   */
  get shadowTexelSize() {
    return this.engine.wasm._wl_light_component_get_shadowTexelSize(this._id);
  }
  /**
   * Set texel size for shadows.
   *
   * @param size Texel size for shadows.
   * @since 1.0.0
   */
  set shadowTexelSize(size) {
    this.engine.wasm._wl_light_component_set_shadowTexelSize(this._id, size);
  }
  /**
   * Cascade count for {@link LightType.Sun} shadows.
   * @since 1.0.0
   */
  get cascadeCount() {
    return this.engine.wasm._wl_light_component_get_cascadeCount(this._id);
  }
  /**
   * Set cascade count for {@link LightType.Sun} shadows.
   *
   * @param count Cascade count.
   * @since 1.0.0
   */
  set cascadeCount(count) {
    this.engine.wasm._wl_light_component_set_cascadeCount(this._id, count);
  }
};
/** @override */
__publicField(LightComponent, "TypeName", "light");
__decorate([
  nativeProperty()
], LightComponent.prototype, "color", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "lightType", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "intensity", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "outerAngle", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "innerAngle", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "shadows", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "shadowRange", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "shadowBias", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "shadowNormalBias", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "shadowTexelSize", null);
__decorate([
  nativeProperty()
], LightComponent.prototype, "cascadeCount", null);
var AnimationComponent = class extends Component {
  /**
   * Emitter for animation events triggered on this component.
   *
   * The first argument is the name of the event.
   */
  onEvent = new Emitter();
  /**
   * Set animation to play.
   *
   * Make sure to {@link Animation#retarget} the animation to affect the
   * right objects.
   *
   * @param anim Animation to play.
   */
  set animation(anim) {
    this.scene.assertOrigin(anim);
    this.engine.wasm._wl_animation_component_set_animation(this._id, anim ? anim._id : 0);
  }
  /** Animation set for this component */
  get animation() {
    const index = this.engine.wasm._wl_animation_component_get_animation(this._id);
    return this._scene.animations.wrap(index);
  }
  /**
   * Set play count. Set to `0` to loop indefinitely.
   *
   * @param playCount Number of times to repeat the animation.
   */
  set playCount(playCount) {
    this.engine.wasm._wl_animation_component_set_playCount(this._id, playCount);
  }
  /** Number of times the animation is played. */
  get playCount() {
    return this.engine.wasm._wl_animation_component_get_playCount(this._id);
  }
  /**
   * Set speed. Set to negative values to run the animation backwards.
   *
   * Setting speed has an immediate effect for the current frame's update
   * and will continue with the speed from the current point in the animation.
   *
   * @param speed New speed at which to play the animation.
   * @since 0.8.10
   */
  set speed(speed) {
    this.engine.wasm._wl_animation_component_set_speed(this._id, speed);
  }
  /**
   * Speed factor at which the animation is played.
   *
   * @since 0.8.10
   */
  get speed() {
    return this.engine.wasm._wl_animation_component_get_speed(this._id);
  }
  /** Current playing state of the animation */
  get state() {
    return this.engine.wasm._wl_animation_component_state(this._id);
  }
  /**
   * Play animation.
   *
   * If the animation is currently paused, resumes from that position. If the
   * animation is already playing, does nothing.
   *
   * To restart the animation, {@link AnimationComponent#stop} it first.
   */
  play() {
    this.engine.wasm._wl_animation_component_play(this._id);
  }
  /** Stop animation. */
  stop() {
    this.engine.wasm._wl_animation_component_stop(this._id);
  }
  /** Pause animation. */
  pause() {
    this.engine.wasm._wl_animation_component_pause(this._id);
  }
  /**
   * Get the value of a float parameter in the attached graph.
   * Throws if the parameter is missing.
   *
   * @param name Name of the parameter.
   * @since 1.2.0
   */
  getFloatParameter(name) {
    const wasm = this.engine.wasm;
    const index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
    if (index === -1) {
      throw Error(`Missing parameter '${name}'`);
    }
    wasm._wl_animation_component_getGraphParamValue(this._id, index, wasm._tempMem);
    return wasm._tempMemFloat[0];
  }
  /**
   * Set the value of a float parameter in the attached graph
   * Throws if the parameter is missing.
   *
   * @param name Name of the parameter.
   * @param value Float value to set.
   * @returns 1 if the parameter was successfully set, 0 on fail.
   * @since 1.2.0
   */
  setFloatParameter(name, value) {
    const wasm = this.engine.wasm;
    const index = wasm._wl_animation_component_getGraphParamIndex(this._id, wasm.tempUTF8(name));
    if (index === -1) {
      throw Error(`Missing parameter '${name}'`);
    }
    wasm._tempMemFloat[0] = value;
    wasm._wl_animation_component_setGraphParamValue(this._id, index, wasm._tempMem);
  }
};
/** @override */
__publicField(AnimationComponent, "TypeName", "animation");
__decorate([
  nativeProperty()
], AnimationComponent.prototype, "animation", null);
__decorate([
  nativeProperty()
], AnimationComponent.prototype, "playCount", null);
__decorate([
  nativeProperty()
], AnimationComponent.prototype, "speed", null);
__decorate([
  enumerable()
], AnimationComponent.prototype, "state", null);
var MeshComponent = class extends Component {
  /**
   * Set material to render the mesh with.
   *
   * @param material Material to render the mesh with.
   */
  set material(material) {
    this.engine.wasm._wl_mesh_component_set_material(this._id, material ? material._id : 0);
  }
  /** Material used to render the mesh. */
  get material() {
    const index = this.engine.wasm._wl_mesh_component_get_material(this._id);
    return this.engine.materials.wrap(index);
  }
  /** Mesh rendered by this component. */
  get mesh() {
    const index = this.engine.wasm._wl_mesh_component_get_mesh(this._id);
    return this.engine.meshes.wrap(index);
  }
  /**
   * Set mesh to rendered with this component.
   *
   * @param mesh Mesh rendered by this component.
   */
  set mesh(mesh) {
    this.engine.wasm._wl_mesh_component_set_mesh(this._id, mesh?._id ?? 0);
  }
  /** Skin for this mesh component. */
  get skin() {
    const index = this.engine.wasm._wl_mesh_component_get_skin(this._id);
    return this._scene.skins.wrap(index);
  }
  /**
   * Set skin to transform this mesh component.
   *
   * @param skin Skin to use for rendering skinned meshes.
   */
  set skin(skin) {
    this.scene.assertOrigin(skin);
    this.engine.wasm._wl_mesh_component_set_skin(this._id, skin ? skin._id : 0);
  }
  /**
   * Morph targets for this mesh component.
   *
   * @since 1.2.0
   */
  get morphTargets() {
    const index = this.engine.wasm._wl_mesh_component_get_morph_targets(this._id);
    return this.engine.morphTargets.wrap(index);
  }
  /**
   * Set morph targets to transform this mesh component.
   *
   * @param morphTargets Morph targets to use for rendering.
   *
   * @since 1.2.0
   */
  set morphTargets(morphTargets) {
    this.engine.wasm._wl_mesh_component_set_morph_targets(this._id, morphTargets?._id ?? 0);
  }
  /**
   * Equivalent to {@link getMorphTargetWeights}.
   *
   * @note Prefer to use {@link getMorphTargetWeights} for performance.
   *
   * @since 1.2.0
   */
  get morphTargetWeights() {
    return this.getMorphTargetWeights();
  }
  /**
   * Set the morph target weights to transform this mesh component.
   *
   * @param weights New weights.
   *
   * @since 1.2.0
   */
  set morphTargetWeights(weights) {
    this.setMorphTargetWeights(weights);
  }
  getMorphTargetWeights(out) {
    const wasm = this.engine.wasm;
    const count = wasm._wl_mesh_component_get_morph_target_weights(this._id, wasm._tempMem);
    if (!out) {
      out = new Float32Array(count);
    }
    for (let i = 0; i < count; ++i) {
      out[i] = wasm._tempMemFloat[i];
    }
    return out;
  }
  /**
   * Get the weight of a single morph target.
   *
   * @param target Index of the morph target.
   * @returns The weight.
   *
   * @since 1.2.0
   */
  getMorphTargetWeight(target) {
    const count = this.morphTargets?.count ?? 0;
    if (target >= count) {
      throw new Error(`Index ${target} is out of bounds for ${count} targets`);
    }
    return this.engine.wasm._wl_mesh_component_get_morph_target_weight(this._id, target);
  }
  /**
   * Set morph target weights for this mesh component.
   *
   * @param weights Array of new weights, expected to have at least as many
   *     elements as {@link MorphTargets.count}.
   *
   * @since 1.2.0
   */
  setMorphTargetWeights(weights) {
    const count = this.morphTargets?.count ?? 0;
    if (weights.length !== count) {
      throw new Error(`Expected ${count} weights but got ${weights.length}`);
    }
    const wasm = this.engine.wasm;
    wasm._tempMemFloat.set(weights);
    wasm._wl_mesh_component_set_morph_target_weights(this._id, wasm._tempMem, weights.length);
  }
  /**
   * Set the weight of a single morph target.
   *
   * @param target Index of the morph target.
   * @param weight The new weight.
   *
   * ## Usage
   *
   * ```js
   * const mesh = object.getComponent('mesh');
   * const mouthTarget = mesh.morphTargets.getTargetIndex('mouth');
   * mesh.setMorphTargetWeight(mouthTarget, 0.5);
   * ```
   *
   * @since 1.2.0
   */
  setMorphTargetWeight(target, weight) {
    const count = this.morphTargets?.count ?? 0;
    if (target >= count) {
      throw new Error(`Index ${target} is out of bounds for ${count} targets`);
    }
    this.engine.wasm._wl_mesh_component_set_morph_target_weight(this._id, target, weight);
  }
};
/** @override */
__publicField(MeshComponent, "TypeName", "mesh");
__decorate([
  nativeProperty()
], MeshComponent.prototype, "material", null);
__decorate([
  nativeProperty()
], MeshComponent.prototype, "mesh", null);
__decorate([
  nativeProperty()
], MeshComponent.prototype, "skin", null);
__decorate([
  nativeProperty()
], MeshComponent.prototype, "morphTargets", null);
__decorate([
  nativeProperty()
], MeshComponent.prototype, "morphTargetWeights", null);
var LockAxis;
(function(LockAxis2) {
  LockAxis2[LockAxis2["None"] = 0] = "None";
  LockAxis2[LockAxis2["X"] = 1] = "X";
  LockAxis2[LockAxis2["Y"] = 2] = "Y";
  LockAxis2[LockAxis2["Z"] = 4] = "Z";
})(LockAxis || (LockAxis = {}));
var PhysXComponent = class extends Component {
  getTranslationOffset(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    wasm._wl_physx_component_get_offsetTranslation(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  getRotationOffset(out = new Float32Array(4)) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_physx_component_get_offsetTransform(this._id) >> 2;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    out[3] = wasm.HEAPF32[ptr + 3];
    return out;
  }
  getExtents(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_physx_component_get_extents(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    return out;
  }
  getLinearVelocity(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    const tempMemFloat = wasm._tempMemFloat;
    wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem);
    out[0] = tempMemFloat[0];
    out[1] = tempMemFloat[1];
    out[2] = tempMemFloat[2];
    return out;
  }
  getAngularVelocity(out = new Float32Array(3)) {
    const wasm = this.engine.wasm;
    const tempMemFloat = wasm._tempMemFloat;
    wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem);
    out[0] = tempMemFloat[0];
    out[1] = tempMemFloat[1];
    out[2] = tempMemFloat[2];
    return out;
  }
  /**
   * Set whether this rigid body is static.
   *
   * Setting this property only takes effect once the component
   * switches from inactive to active.
   *
   * @param b Whether the rigid body should be static.
   */
  set static(b) {
    this.engine.wasm._wl_physx_component_set_static(this._id, b);
  }
  /**
   * Whether this rigid body is static.
   *
   * This property returns whether the rigid body is *effectively*
   * static. If static property was set while the rigid body was
   * active, it will not take effect until the rigid body is set
   * inactive and active again. Until the component is set inactive,
   * this getter will return whether the rigid body is actually
   * static.
   */
  get static() {
    return !!this.engine.wasm._wl_physx_component_get_static(this._id);
  }
  /**
   * Equivalent to {@link PhysXComponent.getTranslationOffset}.
   *
   * Gives a quick view of the offset in a debugger.
   *
   * @note Prefer to use {@link PhysXComponent.getTranslationOffset} for performance.
   *
   * @since 1.1.1
   */
  get translationOffset() {
    return this.getTranslationOffset();
  }
  /**
   * Set the offset translation.
   *
   * The array must be a vector of at least **3** elements.
   *
   * @note The component must be re-activated to apply the change.
   *
   * @since 1.1.1
   */
  set translationOffset(offset2) {
    const wasm = this.engine.wasm;
    wasm._wl_physx_component_set_offsetTranslation(this._id, offset2[0], offset2[1], offset2[2]);
  }
  /**
   * Equivalent to {@link PhysXComponent.getRotationOffset}.
   *
   * Gives a quick view of the offset in a debugger.
   *
   * @note Prefer to use {@link PhysXComponent.getRotationOffset} for performance.
   *
   * @since 1.1.1
   */
  get rotationOffset() {
    return this.getRotationOffset();
  }
  /**
   * Set the offset rotation.
   *
   * The array must be a quaternion of at least **4** elements.
   *
   * @note The component must be re-activated to apply the change.
   *
   * @since 1.1.1
   */
  set rotationOffset(offset2) {
    const wasm = this.engine.wasm;
    wasm._wl_physx_component_set_offsetRotation(this._id, offset2[0], offset2[1], offset2[2], offset2[3]);
  }
  /**
   * Set whether this rigid body is kinematic.
   *
   * @param b Whether the rigid body should be kinematic.
   */
  set kinematic(b) {
    this.engine.wasm._wl_physx_component_set_kinematic(this._id, b);
  }
  /**
   * Whether this rigid body is kinematic.
   */
  get kinematic() {
    return !!this.engine.wasm._wl_physx_component_get_kinematic(this._id);
  }
  /**
   * Set whether this rigid body's gravity is enabled.
   *
   * @param b Whether the rigid body's gravity should be enabled.
   */
  set gravity(b) {
    this.engine.wasm._wl_physx_component_set_gravity(this._id, b);
  }
  /**
   * Whether this rigid body's gravity flag is enabled.
   */
  get gravity() {
    return !!this.engine.wasm._wl_physx_component_get_gravity(this._id);
  }
  /**
   * Set whether this rigid body's simulate flag is enabled.
   *
   * @param b Whether the rigid body's simulate flag should be enabled.
   */
  set simulate(b) {
    this.engine.wasm._wl_physx_component_set_simulate(this._id, b);
  }
  /**
   * Whether this rigid body's simulate flag is enabled.
   */
  get simulate() {
    return !!this.engine.wasm._wl_physx_component_get_simulate(this._id);
  }
  /**
   * Set whether to allow simulation of this rigid body.
   *
   * {@link allowSimulation} and {@link trigger} can not be enabled at the
   * same time. Enabling {@link allowSimulation} while {@link trigger} is enabled
   * will disable {@link trigger}.
   *
   * @param b Whether to allow simulation of this rigid body.
   */
  set allowSimulation(b) {
    this.engine.wasm._wl_physx_component_set_allowSimulation(this._id, b);
  }
  /**
   * Whether to allow simulation of this rigid body.
   */
  get allowSimulation() {
    return !!this.engine.wasm._wl_physx_component_get_allowSimulation(this._id);
  }
  /**
   * Set whether this rigid body may be queried in ray casts.
   *
   * @param b Whether this rigid body may be queried in ray casts.
   */
  set allowQuery(b) {
    this.engine.wasm._wl_physx_component_set_allowQuery(this._id, b);
  }
  /**
   * Whether this rigid body may be queried in ray casts.
   */
  get allowQuery() {
    return !!this.engine.wasm._wl_physx_component_get_allowQuery(this._id);
  }
  /**
   * Set whether this physics body is a trigger.
   *
   * {@link allowSimulation} and {@link trigger} can not be enabled at the
   * same time. Enabling trigger while {@link allowSimulation} is enabled,
   * will disable {@link allowSimulation}.
   *
   * @param b Whether this physics body is a trigger.
   */
  set trigger(b) {
    this.engine.wasm._wl_physx_component_set_trigger(this._id, b);
  }
  /**
   * Whether this physics body is a trigger.
   */
  get trigger() {
    return !!this.engine.wasm._wl_physx_component_get_trigger(this._id);
  }
  /**
   * Set the shape for collision detection.
   *
   * @param s New shape.
   * @since 0.8.5
   */
  set shape(s) {
    this.engine.wasm._wl_physx_component_set_shape(this._id, s);
  }
  /** The shape for collision detection. */
  get shape() {
    return this.engine.wasm._wl_physx_component_get_shape(this._id);
  }
  /**
   * Set additional data for the shape.
   *
   * Retrieved only from {@link PhysXComponent#shapeData}.
   * @since 0.8.10
   */
  set shapeData(d) {
    if (d == null || !isMeshShape(this.shape))
      return;
    this.engine.wasm._wl_physx_component_set_shape_data(this._id, d.index);
  }
  /**
   * Additional data for the shape.
   *
   * `null` for {@link Shape} values: `None`, `Sphere`, `Capsule`, `Box`, `Plane`.
   * `{index: n}` for `TriangleMesh` and `ConvexHull`.
   *
   * This data is currently only for passing onto or creating other {@link PhysXComponent}.
   * @since 0.8.10
   */
  get shapeData() {
    if (!isMeshShape(this.shape))
      return null;
    return {
      index: this.engine.wasm._wl_physx_component_get_shape_data(this._id)
    };
  }
  /**
   * Set the shape extents for collision detection.
   *
   * @param e New extents for the shape.
   * @since 0.8.5
   */
  set extents(e) {
    this.extents.set(e);
  }
  /**
   * Equivalent to {@link PhysXComponent.getExtents}.
   *
   * @note Prefer to use {@link PhysXComponent.getExtents} for performance.
   */
  get extents() {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_physx_component_get_extents(this._id);
    return new Float32Array(wasm.HEAPF32.buffer, ptr, 3);
  }
  /**
   * Get staticFriction.
   */
  get staticFriction() {
    return this.engine.wasm._wl_physx_component_get_staticFriction(this._id);
  }
  /**
   * Set staticFriction.
   * @param v New staticFriction.
   */
  set staticFriction(v) {
    this.engine.wasm._wl_physx_component_set_staticFriction(this._id, v);
  }
  /**
   * Get dynamicFriction.
   */
  get dynamicFriction() {
    return this.engine.wasm._wl_physx_component_get_dynamicFriction(this._id);
  }
  /**
   * Set dynamicFriction
   * @param v New dynamicDamping.
   */
  set dynamicFriction(v) {
    this.engine.wasm._wl_physx_component_set_dynamicFriction(this._id, v);
  }
  /**
   * Get bounciness.
   * @since 0.9.0
   */
  get bounciness() {
    return this.engine.wasm._wl_physx_component_get_bounciness(this._id);
  }
  /**
   * Set bounciness.
   * @param v New bounciness.
   * @since 0.9.0
   */
  set bounciness(v) {
    this.engine.wasm._wl_physx_component_set_bounciness(this._id, v);
  }
  /**
   * Get linearDamping/
   */
  get linearDamping() {
    return this.engine.wasm._wl_physx_component_get_linearDamping(this._id);
  }
  /**
   * Set linearDamping.
   * @param v New linearDamping.
   */
  set linearDamping(v) {
    this.engine.wasm._wl_physx_component_set_linearDamping(this._id, v);
  }
  /** Get angularDamping. */
  get angularDamping() {
    return this.engine.wasm._wl_physx_component_get_angularDamping(this._id);
  }
  /**
   * Set angularDamping.
   * @param v New angularDamping.
   */
  set angularDamping(v) {
    this.engine.wasm._wl_physx_component_set_angularDamping(this._id, v);
  }
  /**
   * Set linear velocity.
   *
   * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
   *
   * Has no effect, if the component is not active.
   *
   * @param v New linear velocity.
   */
  set linearVelocity(v) {
    this.engine.wasm._wl_physx_component_set_linearVelocity(this._id, v[0], v[1], v[2]);
  }
  /**
   * Equivalent to {@link PhysXComponent.getLinearVelocity}.
   *
   * @note Prefer to use {@link PhysXComponent.getLinearVelocity} for performance.
   */
  get linearVelocity() {
    const wasm = this.engine.wasm;
    wasm._wl_physx_component_get_linearVelocity(this._id, wasm._tempMem);
    return new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
  }
  /**
   * Set angular velocity
   *
   * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
   *
   * Has no effect, if the component is not active.
   *
   * @param v New angular velocity
   */
  set angularVelocity(v) {
    this.engine.wasm._wl_physx_component_set_angularVelocity(this._id, v[0], v[1], v[2]);
  }
  /**
   * Equivalent to {@link PhysXComponent.getAngularVelocity}.
   *
   * @note Prefer to use {@link PhysXComponent.getAngularVelocity} for performance.
   */
  get angularVelocity() {
    const wasm = this.engine.wasm;
    wasm._wl_physx_component_get_angularVelocity(this._id, wasm._tempMem);
    return new Float32Array(wasm.HEAPF32.buffer, wasm._tempMem, 3);
  }
  /**
   * Set the components groups mask.
   *
   * @param flags New flags that need to be set.
   */
  set groupsMask(flags) {
    this.engine.wasm._wl_physx_component_set_groupsMask(this._id, flags);
  }
  /**
   * Get the components groups mask flags.
   *
   * Each bit represents membership to group, see example.
   *
   * ```js
   * // Assign c to group 2
   * c.groupsMask = (1 << 2);
   *
   * // Assign c to group 0
   * c.groupsMask  = (1 << 0);
   *
   * // Assign c to group 0 and 2
   * c.groupsMask = (1 << 0) | (1 << 2);
   *
   * (c.groupsMask & (1 << 2)) != 0; // true
   * (c.groupsMask & (1 << 7)) != 0; // false
   * ```
   */
  get groupsMask() {
    return this.engine.wasm._wl_physx_component_get_groupsMask(this._id);
  }
  /**
   * Set the components blocks mask.
   *
   * @param flags New flags that need to be set.
   */
  set blocksMask(flags) {
    this.engine.wasm._wl_physx_component_set_blocksMask(this._id, flags);
  }
  /**
   * Get the components blocks mask flags.
   *
   * Each bit represents membership to the block, see example.
   *
   * ```js
   * // Block overlap with any objects in group 2
   * c.blocksMask = (1 << 2);
   *
   * // Block overlap with any objects in group 0
   * c.blocksMask  = (1 << 0)
   *
   * // Block overlap with any objects in group 0 and 2
   * c.blocksMask = (1 << 0) | (1 << 2);
   *
   * (c.blocksMask & (1 << 2)) != 0; // true
   * (c.blocksMask & (1 << 7)) != 0; // false
   * ```
   */
  get blocksMask() {
    return this.engine.wasm._wl_physx_component_get_blocksMask(this._id);
  }
  /**
   * Set axes to lock for linear velocity.
   *
   * @param lock The Axis that needs to be set.
   *
   * Combine flags with Bitwise OR:
   *
   * ```js
   * body.linearLockAxis = LockAxis.X | LockAxis.Y; // x and y set
   * body.linearLockAxis = LockAxis.X; // y unset
   * ```
   *
   * @note This has no effect if the component is static.
   */
  set linearLockAxis(lock) {
    this.engine.wasm._wl_physx_component_set_linearLockAxis(this._id, lock);
  }
  /**
   * Get the linear lock axes flags.
   *
   * To get the state of a specific flag, Bitwise AND with the LockAxis needed.
   *
   * ```js
   * if(body.linearLockAxis & LockAxis.Y) {
   *     console.log("The Y flag was set!");
   * }
   * ```
   *
   * @return axes that are currently locked for linear movement.
   */
  get linearLockAxis() {
    return this.engine.wasm._wl_physx_component_get_linearLockAxis(this._id);
  }
  /**
   * Set axes to lock for angular velocity.
   *
   * @param lock The Axis that needs to be set.
   *
   * ```js
   * body.angularLockAxis = LockAxis.X | LockAxis.Y; // x and y set
   * body.angularLockAxis = LockAxis.X; // y unset
   * ```
   *
   * @note This has no effect if the component is static.
   */
  set angularLockAxis(lock) {
    this.engine.wasm._wl_physx_component_set_angularLockAxis(this._id, lock);
  }
  /**
   * Get the angular lock axes flags.
   *
   * To get the state of a specific flag, Bitwise AND with the LockAxis needed:
   *
   * ```js
   * if(body.angularLockAxis & LockAxis.Y) {
   *     console.log("The Y flag was set!");
   * }
   * ```
   *
   * @return axes that are currently locked for angular movement.
   */
  get angularLockAxis() {
    return this.engine.wasm._wl_physx_component_get_angularLockAxis(this._id);
  }
  /**
   * Set mass.
   *
   * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
   *
   * @param m New mass.
   */
  set mass(m) {
    this.engine.wasm._wl_physx_component_set_mass(this._id, m);
  }
  /** Mass */
  get mass() {
    return this.engine.wasm._wl_physx_component_get_mass(this._id);
  }
  /**
   * Set mass space interia tensor.
   *
   * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
   *
   * Has no effect, if the component is not active.
   *
   * @param v New mass space interatia tensor.
   */
  set massSpaceInteriaTensor(v) {
    this.engine.wasm._wl_physx_component_set_massSpaceInertiaTensor(this._id, v[0], v[1], v[2]);
  }
  /**
   * Set the rigid body to sleep upon activation.
   *
   * When asleep, the rigid body will not be simulated until the next contact.
   *
   * @param flag `true` to sleep upon activation.
   *
   * @since 1.1.5
   */
  set sleepOnActivate(flag) {
    this.engine.wasm._wl_physx_component_set_sleepOnActivate(this._id, flag);
  }
  /**
   * `true` if the rigid body is set to sleep upon activation, `false` otherwise.
   *
   * @since 1.1.5
   */
  get sleepOnActivate() {
    return !!this.engine.wasm._wl_physx_component_get_sleepOnActivate(this._id);
  }
  /**
   * Apply a force.
   *
   * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
   *
   * Has no effect, if the component is not active.
   *
   * @param f Force vector.
   * @param m Force mode, see {@link ForceMode}, default `Force`.
   * @param localForce Whether the force vector is in local space, default `false`.
   * @param p Position to apply force at, default is center of mass.
   * @param local Whether position is in local space, default `false`.
   */
  addForce(f, m = ForceMode.Force, localForce = false, p, local = false) {
    const wasm = this.engine.wasm;
    if (!p) {
      wasm._wl_physx_component_addForce(this._id, f[0], f[1], f[2], m, localForce);
      return;
    }
    wasm._wl_physx_component_addForceAt(this._id, f[0], f[1], f[2], m, localForce, p[0], p[1], p[2], local);
  }
  /**
   * Apply torque.
   *
   * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
   *
   * Has no effect, if the component is not active.
   *
   * @param f Force vector.
   * @param m Force mode, see {@link ForceMode}, default `Force`.
   */
  addTorque(f, m = ForceMode.Force) {
    this.engine.wasm._wl_physx_component_addTorque(this._id, f[0], f[1], f[2], m);
  }
  /**
   * Add on collision callback.
   *
   * @param callback Function to call when this rigid body (un)collides with any other.
   *
   * ```js
   *  let rigidBody = this.object.getComponent('physx');
   *  rigidBody.onCollision(function(type, other) {
   *      // Ignore uncollides
   *      if(type == CollisionEventType.TouchLost) return;
   *
   *      // Take damage on collision with enemies
   *      if(other.object.name.startsWith("enemy-")) {
   *          this.applyDamage(10);
   *      }
   *  }.bind(this));
   * ```
   *
   * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
   */
  onCollision(callback) {
    return this.onCollisionWith(this, callback);
  }
  /**
   * Add filtered on collision callback.
   *
   * @param otherComp Component for which callbacks will
   *        be triggered. If you pass this component, the method is equivalent to.
   *        {@link PhysXComponent#onCollision}.
   * @param callback Function to call when this rigid body
   *        (un)collides with `otherComp`.
   * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
   */
  onCollisionWith(otherComp, callback) {
    const physics = this.engine.physics;
    physics._callbacks[this._id] = physics._callbacks[this._id] || [];
    physics._callbacks[this._id].push(callback);
    return this.engine.wasm._wl_physx_component_addCallback(this._id, otherComp._id || this._id);
  }
  /**
   * Remove a collision callback added with {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
   *
   * @param callbackId Callback id as returned by {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
   * @throws When the callback does not belong to the component.
   * @throws When the callback does not exist.
   */
  removeCollisionCallback(callbackId) {
    const physics = this.engine.physics;
    const r = this.engine.wasm._wl_physx_component_removeCallback(this._id, callbackId);
    if (r)
      physics._callbacks[this._id].splice(-r);
  }
};
/** @override */
__publicField(PhysXComponent, "TypeName", "physx");
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "static", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "translationOffset", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "rotationOffset", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "kinematic", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "gravity", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "simulate", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "allowSimulation", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "allowQuery", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "trigger", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "shape", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "shapeData", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "extents", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "staticFriction", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "dynamicFriction", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "bounciness", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "linearDamping", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "angularDamping", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "linearVelocity", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "angularVelocity", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "groupsMask", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "blocksMask", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "linearLockAxis", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "angularLockAxis", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "mass", null);
__decorate([
  nativeProperty()
], PhysXComponent.prototype, "sleepOnActivate", null);
var Physics = class {
  /**
   * @hidden
   *
   * **Note**: This is public to emulate a `friend` accessor.
   */
  _callbacks;
  /**
   * Hit.
   * @hidden
   */
  _hit;
  /**
   * Wonderland Engine instance
   * @hidden
   */
  _engine;
  /**
   * Ray Hit
   * @hidden
   */
  _rayHit;
  constructor(engine2) {
    this._engine = engine2;
    this._rayHit = engine2.wasm._malloc(4 * (3 * 4 + 3 * 4 + 4 + 2) + 4);
    this._hit = new RayHit(engine2.scene, this._rayHit);
    this._callbacks = {};
  }
  /**
   * Cast a ray through the scene and find intersecting physics components.
   *
   * The resulting ray hit will contain **up to 4** closest ray hits,
   * sorted by increasing distance.
   *
   * Example:
   *
   * ```js
   * const hit = engine.physics.rayCast(
   *     [0, 0, 0],
   *     [0, 0, 1],
   *     1 << 0 | 1 << 4, // Only check against physics components in groups 0 and 4
   *     25
   * );
   * if (hit.hitCount > 0) {
   *     const locations = hit.getLocations();
   *     console.log(`Object hit at: ${locations[0][0]}, ${locations[0][1]}, ${locations[0][2]}`);
   * }
   * ```
   *
   * @param o Ray origin.
   * @param d Ray direction.
   * @param groupMask Bitmask of physics groups to filter by: only objects
   *        that are part of given groups are considered for the raycast.
   * @param maxDistance Maximum **inclusive** hit distance. Defaults to `100`.
   *
   * @returns The {@link RayHit} instance, cached by this class.
   *
   * @note The returned {@link RayHit} object is owned by the {@link Physics}
   *       instance and will be reused with the next {@link Physics#rayCast} call.
   */
  rayCast(o, d, groupMask, maxDistance = 100) {
    const scene = this._engine.scene._index;
    this._engine.wasm._wl_physx_ray_cast(scene, o[0], o[1], o[2], d[0], d[1], d[2], groupMask, maxDistance, this._rayHit);
    return this._hit;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
};
var MeshIndexType;
(function(MeshIndexType2) {
  MeshIndexType2[MeshIndexType2["UnsignedByte"] = 1] = "UnsignedByte";
  MeshIndexType2[MeshIndexType2["UnsignedShort"] = 2] = "UnsignedShort";
  MeshIndexType2[MeshIndexType2["UnsignedInt"] = 4] = "UnsignedInt";
})(MeshIndexType || (MeshIndexType = {}));
var MeshSkinningType;
(function(MeshSkinningType2) {
  MeshSkinningType2[MeshSkinningType2["None"] = 0] = "None";
  MeshSkinningType2[MeshSkinningType2["FourJoints"] = 1] = "FourJoints";
  MeshSkinningType2[MeshSkinningType2["EightJoints"] = 2] = "EightJoints";
})(MeshSkinningType || (MeshSkinningType = {}));
var Mesh = class extends Resource {
  /**
   * @deprecated Use {@link MeshManager.create} instead, accessible via {@link WonderlandEngine.meshes}:
   *
   * ```js
   * const mesh = engine.meshes.create({vertexCount: 3, indexData: [0, 1, 2]});
   * ...
   * mesh.update();
   * ```
   */
  constructor(engine2, params) {
    if (!isNumber(params)) {
      const mesh = engine2.meshes.create(params);
      super(engine2, mesh._index);
      return mesh;
    }
    super(engine2, params);
  }
  /** Number of vertices in this mesh. */
  get vertexCount() {
    return this.engine.wasm._wl_mesh_get_vertexCount(this._id);
  }
  /** Index data (read-only) or `null` if the mesh is not indexed. */
  get indexData() {
    const wasm = this.engine.wasm;
    const tempMem = wasm._tempMem;
    const ptr = wasm._wl_mesh_get_indexData(this._id, tempMem, tempMem + 4);
    if (ptr === null)
      return null;
    const indexCount = wasm.HEAPU32[tempMem / 4];
    const indexSize = wasm.HEAPU32[tempMem / 4 + 1];
    switch (indexSize) {
      case MeshIndexType.UnsignedByte:
        return new Uint8Array(wasm.HEAPU8.buffer, ptr, indexCount);
      case MeshIndexType.UnsignedShort:
        return new Uint16Array(wasm.HEAPU16.buffer, ptr, indexCount);
      case MeshIndexType.UnsignedInt:
        return new Uint32Array(wasm.HEAPU32.buffer, ptr, indexCount);
    }
    return null;
  }
  /**
   * Apply changes to {@link attribute | vertex attributes}.
   *
   * Uploads the updated vertex attributes to the GPU and updates the bounding
   * sphere to match the new vertex positions.
   *
   * Since this is an expensive operation, call it only once you have performed
   * all modifications on a mesh and avoid calling if you did not perform any
   * modifications at all.
   */
  update() {
    this.engine.wasm._wl_mesh_update(this._id);
  }
  getBoundingSphere(out = new Float32Array(4)) {
    const wasm = this.engine.wasm;
    this.engine.wasm._wl_mesh_get_boundingSphere(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    out[3] = wasm._tempMemFloat[3];
    return out;
  }
  attribute(attr) {
    if (typeof attr != "number")
      throw new TypeError("Expected number, but got " + typeof attr);
    const wasm = this.engine.wasm;
    const tempMemUint32 = wasm._tempMemUint32;
    wasm._wl_mesh_get_attribute(this._id, attr, wasm._tempMem);
    if (tempMemUint32[0] == 255)
      return null;
    const arraySize = tempMemUint32[5];
    return new MeshAttributeAccessor(this.engine, {
      attribute: tempMemUint32[0],
      offset: tempMemUint32[1],
      stride: tempMemUint32[2],
      formatSize: tempMemUint32[3],
      componentCount: tempMemUint32[4],
      /* The WASM API returns `0` for a scalar value. We clamp it to 1 as we strictly use it as a multiplier for get/set operations */
      arraySize: arraySize ? arraySize : 1,
      length: this.vertexCount,
      bufferType: attr !== MeshAttribute.JointId ? Float32Array : Uint16Array
    });
  }
  /**
   * Destroy and free the meshes memory.
   *
   * It is best practice to set the mesh variable to `null` after calling
   * destroy to prevent accidental use:
   *
   * ```js
   *   mesh.destroy();
   *   mesh = null;
   * ```
   *
   * Accessing the mesh after destruction behaves like accessing an empty
   * mesh.
   *
   * @since 0.9.0
   */
  destroy() {
    this.engine.wasm._wl_mesh_destroy(this._id);
    this.engine.meshes._destroy(this);
  }
  toString() {
    if (this.isDestroyed) {
      return "Mesh(destroyed)";
    }
    return `Mesh(${this._index})`;
  }
};
var MeshAttributeAccessor = class {
  /** Max number of elements. */
  length = 0;
  /** Wonderland Engine instance. @hidden */
  _engine;
  /** Attribute index. @hidden */
  _attribute = -1;
  /** Attribute offset. @hidden */
  _offset = 0;
  /** Attribute stride. @hidden */
  _stride = 0;
  /** Format size native enum. @hidden */
  _formatSize = 0;
  /** Number of components per vertex. @hidden */
  _componentCount = 0;
  /** Number of values per vertex. @hidden */
  _arraySize = 1;
  /**
   * Class to instantiate an ArrayBuffer to get/set values.
   */
  _bufferType;
  /**
   * Function to allocate temporary WASM memory. It is cached in the accessor to avoid
   * conditionals during get/set.
   */
  _tempBufferGetter;
  /**
   * Create a new instance.
   *
   * @note Please use {@link Mesh.attribute} to create a new instance.
   *
   * @param options Contains information about how to read the data.
   * @note Do not use this constructor. Instead, please use the {@link Mesh.attribute} method.
   *
   * @hidden
   */
  constructor(engine2, options) {
    this._engine = engine2;
    const wasm = this._engine.wasm;
    this._attribute = options.attribute;
    this._offset = options.offset;
    this._stride = options.stride;
    this._formatSize = options.formatSize;
    this._componentCount = options.componentCount;
    this._arraySize = options.arraySize;
    this._bufferType = options.bufferType;
    this.length = options.length;
    this._tempBufferGetter = this._bufferType === Float32Array ? wasm.getTempBufferF32.bind(wasm) : wasm.getTempBufferU16.bind(wasm);
  }
  /**
   * Create a new TypedArray to hold this attribute's values.
   *
   * This method is useful to create a view to hold the data to
   * pass to {@link get} and {@link set}
   *
   * Example:
   *
   * ```js
   * const vertexCount = 4;
   * const positionAttribute = mesh.attribute(MeshAttribute.Position);
   *
   * // A position has 3 floats per vertex. Thus, positions has length 3 * 4.
   * const positions = positionAttribute.createArray(vertexCount);
   * ```
   *
   * @param count The number of **vertices** expected.
   * @returns A TypedArray with the appropriate format to access the data
   */
  createArray(count = 1) {
    count = count > this.length ? this.length : count;
    return new this._bufferType(count * this._componentCount * this._arraySize);
  }
  get(index, out = this.createArray()) {
    if (out.length % this._componentCount !== 0) {
      throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
    }
    const dest = this._tempBufferGetter(out.length);
    const elementSize = this._bufferType.BYTES_PER_ELEMENT;
    const destSize = elementSize * out.length;
    const srcFormatSize = this._formatSize * this._arraySize;
    const destFormatSize = this._componentCount * elementSize * this._arraySize;
    this._engine.wasm._wl_mesh_get_attribute_values(this._attribute, srcFormatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, destSize);
    for (let i = 0; i < out.length; ++i)
      out[i] = dest[i];
    return out;
  }
  /**
   * Set attribute element.
   *
   * @param i Index
   * @param v Value to set the element to
   *
   * `v.length` needs to be a multiple of the attributes component count, see
   * {@link MeshAttribute}. If `v.length` is more than one multiple, it will be
   * filled with the next n attribute elements, which can reduce overhead
   * of this call.
   *
   * @returns Reference to self (for method chaining)
   */
  set(i, v) {
    if (v.length % this._componentCount !== 0)
      throw new Error(`out.length, ${v.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
    const elementSize = this._bufferType.BYTES_PER_ELEMENT;
    const srcSize = elementSize * v.length;
    const srcFormatSize = this._componentCount * elementSize * this._arraySize;
    const destFormatSize = this._formatSize * this._arraySize;
    const wasm = this._engine.wasm;
    if (v.buffer != wasm.HEAPU8.buffer) {
      const dest = this._tempBufferGetter(v.length);
      dest.set(v);
      v = dest;
    }
    wasm._wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v.byteOffset, srcSize, destFormatSize, this._offset + i * this._stride, this._stride);
    return this;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
};
var Font = class extends Resource {
  /** Em height in object space. Equivalent to line height. */
  get emHeight() {
    return this.engine.wasm._wl_font_get_emHeight(this._id);
  }
  /**
   * Cap height in object space. This is the typical height of capital
   * letters. Can be 0 if not defined by the font.
   */
  get capHeight() {
    return this.engine.wasm._wl_font_get_capHeight(this._id);
  }
  /**
   * X height in object space. This is the typical height of lowercase
   * letters. Can be 0 if not defined by the font.
   */
  get xHeight() {
    return this.engine.wasm._wl_font_get_xHeight(this._id);
  }
  /**
   * Outline size. This is the factor by which characters are expanded to
   * create the outline effect. Returns 0 if the font was compiled without
   * an outline.
   *
   * @since 1.2.1
   */
  get outlineSize() {
    return this.engine.wasm._wl_font_get_outlineSize(this._id);
  }
};
var temp2d = null;
var Texture = class extends Resource {
  /**
   * @deprecated Use {@link TextureManager.create} instead, accessible via
   * {@link WonderlandEngine.textures}:
   *
   * ```js
   * const image = new Image();
   * image.onload = () => {
   *     const texture = engine.textures.create(image);
   * };
   * ```
   */
  constructor(engine2, param) {
    if (isImageLike(param)) {
      const texture = engine2.textures.create(param);
      super(engine2, texture._index);
      return texture;
    }
    super(engine2, param);
  }
  /**
   * Whether this texture is valid
   *
   * @deprecated Use {@link SceneResource#isDestroyed} instead.
   */
  get valid() {
    return !this.isDestroyed;
  }
  /**
   * Index in this manager.
   *
   * @deprecated Use {@link Texture.index} instead.
   */
  get id() {
    return this.index;
  }
  /** Update the texture to match the HTML element (e.g. reflect the current frame of a video). */
  update() {
    const image = this._imageIndex;
    if (!this.valid || !image)
      return;
    this.engine.wasm._wl_renderer_updateImage(image);
  }
  /** Width of the texture. */
  get width() {
    const element = this.htmlElement;
    if (element)
      return element.width;
    const wasm = this.engine.wasm;
    wasm._wl_image_size(this._imageIndex, wasm._tempMem);
    return wasm._tempMemUint32[0];
  }
  /** Height of the texture. */
  get height() {
    const element = this.htmlElement;
    if (element)
      return element.height;
    const wasm = this.engine.wasm;
    wasm._wl_image_size(this._imageIndex, wasm._tempMem);
    return wasm._tempMemUint32[1];
  }
  /**
   * Returns the html element associated to this texture.
   *
   * @note This accessor will return `null` if the image is compressed.
   */
  get htmlElement() {
    const image = this._imageIndex;
    if (!image)
      return null;
    const wasm = this.engine.wasm;
    const jsImageIndex = wasm._wl_image_get_jsImage_index(image);
    return wasm._images[jsImageIndex];
  }
  /**
   * Update a subrange on the texture to match the HTML element (e.g. reflect the current frame of a video).
   *
   * Usage:
   *
   * ```js
   * // Copies rectangle of pixel starting from (10, 20)
   * texture.updateSubImage(10, 20, 600, 400);
   * ```
   *
   * @param x x offset
   * @param y y offset
   * @param w width
   * @param h height
   */
  updateSubImage(x, y, w, h) {
    if (this.isDestroyed)
      return;
    const image = this._imageIndex;
    if (!image)
      return;
    const wasm = this.engine.wasm;
    const jsImageIndex = wasm._wl_image_get_jsImage_index(image);
    if (!temp2d) {
      const canvas2 = document.createElement("canvas");
      const ctx = canvas2.getContext("2d");
      if (!ctx) {
        throw new Error("Texture.updateSubImage(): Failed to obtain CanvasRenderingContext2D.");
      }
      temp2d = {
        canvas: canvas2,
        ctx
      };
    }
    const img = wasm._images[jsImageIndex];
    if (!img)
      return;
    temp2d.canvas.width = w;
    temp2d.canvas.height = h;
    temp2d.ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    const yOffset = (img.videoHeight ?? img.height) - y - h;
    wasm._images[jsImageIndex] = temp2d.canvas;
    wasm._wl_renderer_updateImage(image, x, yOffset);
    wasm._images[jsImageIndex] = img;
  }
  /**
   * Destroy and free the texture's texture altas space and memory.
   *
   * It is best practice to set the texture variable to `null` after calling
   * destroy to prevent accidental use of the invalid texture:
   *
   * ```js
   *   texture.destroy();
   *   texture = null;
   * ```
   *
   * @since 0.9.0
   */
  destroy() {
    const wasm = this.engine.wasm;
    wasm._wl_texture_destroy(this._id);
    this.engine.textures._destroy(this);
  }
  toString() {
    if (this.isDestroyed) {
      return "Texture(destroyed)";
    }
    return `Texture(${this._index})`;
  }
  get _imageIndex() {
    return this.engine.wasm._wl_texture_get_image_index(this._id);
  }
};
var Animation = class extends SceneResource {
  /**
   * @param index Index in the manager
   */
  constructor(host = WL, index) {
    const scene = host instanceof Prefab ? host : host.scene;
    super(scene, index);
  }
  /** Duration of this animation. */
  get duration() {
    return this.engine.wasm._wl_animation_get_duration(this._id);
  }
  /** Number of tracks in this animation. */
  get trackCount() {
    return this.engine.wasm._wl_animation_get_trackCount(this._id);
  }
  /**
   * Clone this animation retargeted to a new set of objects.
   *
   * The clone shares most of the data with the original and is therefore
   * light-weight.
   *
   * **Experimental:** This API might change in upcoming versions.
   *
   * If retargeting to {@link Skin}, the join names will be used to determine a mapping
   * from the previous skin to the new skin. The source skin will be retrieved from
   * the first track in the animation that targets a joint.
   *
   * @param newTargets New targets per track. Expected to have
   *      {@link Animation#trackCount} elements or to be a {@link Skin}.
   * @returns The retargeted clone of this animation.
   */
  retarget(newTargets) {
    const wasm = this.engine.wasm;
    if (newTargets instanceof Skin) {
      const index2 = wasm._wl_animation_retargetToSkin(this._id, newTargets._id);
      return this._scene.animations.wrap(index2);
    }
    if (newTargets.length != this.trackCount) {
      throw Error("Expected " + this.trackCount.toString() + " targets, but got " + newTargets.length.toString());
    }
    const ptr = wasm._malloc(2 * newTargets.length);
    for (let i = 0; i < newTargets.length; ++i) {
      const object3d = newTargets[i];
      this.scene.assertOrigin(object3d);
      wasm.HEAPU16[ptr >> 1 + i] = newTargets[i].objectId;
    }
    const index = wasm._wl_animation_retarget(this._id, ptr);
    wasm._free(ptr);
    return this._scene.animations.wrap(index);
  }
  toString() {
    if (this.isDestroyed) {
      return "Animation(destroyed)";
    }
    return `Animation(${this._index})`;
  }
};
var Object3D = class {
  /**
   * Packed object id, containing scene index and local id.
   *
   * @hidden
   */
  _id = -1;
  /** Object id, relative to the scene manager. @hidden */
  _localId = -1;
  /** Scene instance. @hidden */
  _scene;
  /** Wonderland Engine instance. @hidden */
  _engine;
  /**
   * @param o Object id to wrap.
   *
   * @deprecated Objects must be obtained via {@link Scene.addObject} or {@link Scene.wrap}:
   *
   * ```js
   * // Create a new object.
   * const obj = scene.addObject();
   *
   * // Wrap an object using its id. The id must be valid.
   * const obj = scene.wrap(0);
   * ```
   *
   * @hidden
   */
  constructor(scene, id) {
    scene = scene instanceof Prefab ? scene : scene.scene;
    this._localId = id;
    this._id = scene._index << 22 | id;
    this._scene = scene;
    this._engine = scene.engine;
  }
  /**
   * Name of the object.
   *
   * Useful for identifying objects during debugging.
   */
  get name() {
    const wasm = this._engine.wasm;
    return wasm.UTF8ToString(wasm._wl_object_name(this._id));
  }
  /**
   * Set the object's name.
   *
   * @param newName The new name to set.
   */
  set name(newName) {
    const wasm = this._engine.wasm;
    wasm._wl_object_set_name(this._id, wasm.tempUTF8(newName));
  }
  /**
   * Parent of this object or `null` if parented to root.
   */
  get parent() {
    const p = this._engine.wasm._wl_object_parent(this._id);
    return p === 0 ? null : this._scene.wrap(p);
  }
  /**
   * Equivalent to {@link Object3D.getChildren}.
   *
   * @note Prefer to use {@link Object3D.getChildren} for performance.
   */
  get children() {
    return this.getChildren();
  }
  /** The number of children of this object. */
  get childrenCount() {
    return this._engine.wasm._wl_object_get_children_count(this._id);
  }
  /**
   * Reparent object to given object.
   *
   * @note Reparenting is not trivial and might have a noticeable performance impact.
   *
   * @param newParent New parent or `null` to parent to root
   */
  set parent(newParent) {
    this.scene.assertOrigin(newParent);
    this._engine.wasm._wl_object_set_parent(this._id, newParent == null ? 0 : newParent._id);
  }
  /** Local object id in the scene manager. */
  get objectId() {
    return this._localId;
  }
  /** Scene instance. */
  get scene() {
    return this._scene;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
  /**
   * Clone this hierarchy into a new one.
   *
   * Cloning copies the hierarchy structure, object names,
   * as well as components.
   *
   * JavaScript components are cloned using {@link Component.copy}. You can
   * override this method in your components.
   *
   * @param parent The parent for the cloned hierarchy or `null` to clone
   *     into the scene root. Defaults to `null`.
   *
   * @returns The clone of this object.
   */
  clone(parent = null) {
    this.scene.assertOrigin(parent);
    const engine2 = this._engine;
    const id = engine2.wasm._wl_object_clone(this._id, parent ? parent._id : 0);
    return this._scene.wrap(id);
  }
  /**
   * Children of this object.
   *
   * @note Child order is **undefined**. No assumptions should be made
   * about the index of a specific object.
   *
   * If you need to access a specific child of this object, you can
   * use {@link Object3D.findByName}.
   *
   * When the object exists in the scene at editor time, prefer passing it as
   * a component property.
   *
   * @note When providing an output array, only `this.childrenCount` elements will be written.
   * The rest of the array will not be modified by this method.
   *
   * @param out Destination array, expected to have at least `this.childrenCount` elements.
   * @returns The `out` parameter.
   */
  getChildren(out = new Array(this.childrenCount)) {
    const childrenCount = this.childrenCount;
    if (childrenCount === 0)
      return out;
    const wasm = this._engine.wasm;
    wasm.requireTempMem(childrenCount * 2);
    this._engine.wasm._wl_object_get_children(this._id, wasm._tempMem, wasm._tempMemSize >> 1);
    for (let i = 0; i < childrenCount; ++i) {
      out[i] = this._scene.wrap(wasm._tempMemUint16[i]);
    }
    return out;
  }
  /**
   * Reset local transformation (translation, rotation and scaling) to identity.
   *
   * @returns Reference to self (for method chaining).
   */
  resetTransform() {
    this._engine.wasm._wl_object_reset_translation_rotation(this._id);
    this._engine.wasm._wl_object_reset_scaling(this._id);
    return this;
  }
  /**
   * Reset local position and rotation to identity.
   *
   * @returns Reference to self (for method chaining).
   */
  resetPositionRotation() {
    this._engine.wasm._wl_object_reset_translation_rotation(this._id);
    return this;
  }
  /** @deprecated Please use {@link Object3D.resetPositionRotation} instead. */
  resetTranslationRotation() {
    return this.resetPositionRotation();
  }
  /**
   * Reset local rotation, keep translation.
   *
   * @note To reset both rotation and translation, prefer
   *       {@link resetTranslationRotation}.
   *
   * @returns Reference to self (for method chaining).
   */
  resetRotation() {
    this._engine.wasm._wl_object_reset_rotation(this._id);
    return this;
  }
  /**
   * Reset local translation, keep rotation.
   *
   * @note To reset both rotation and translation, prefer
   *       {@link resetTranslationRotation}.
   *
   * @returns Reference to self (for method chaining).
   */
  resetPosition() {
    this._engine.wasm._wl_object_reset_translation(this._id);
    return this;
  }
  /** @deprecated Please use {@link Object3D.resetPosition} instead. */
  resetTranslation() {
    return this.resetPosition();
  }
  /**
   * Reset local scaling to identity (``[1.0, 1.0, 1.0]``).
   *
   * @returns Reference to self (for method chaining).
   */
  resetScaling() {
    this._engine.wasm._wl_object_reset_scaling(this._id);
    return this;
  }
  /** @deprecated Please use {@link Object3D.translateLocal} instead. */
  translate(v) {
    return this.translateLocal(v);
  }
  /**
   * Translate object by a vector in the parent's space.
   *
   * @param v Vector to translate by.
   *
   * @returns Reference to self (for method chaining).
   */
  translateLocal(v) {
    this._engine.wasm._wl_object_translate(this._id, v[0], v[1], v[2]);
    return this;
  }
  /**
   * Translate object by a vector in object space.
   *
   * @param v Vector to translate by.
   *
   * @returns Reference to self (for method chaining).
   */
  translateObject(v) {
    this._engine.wasm._wl_object_translate_obj(this._id, v[0], v[1], v[2]);
    return this;
  }
  /**
   * Translate object by a vector in world space.
   *
   * @param v Vector to translate by.
   *
   * @returns Reference to self (for method chaining).
   */
  translateWorld(v) {
    this._engine.wasm._wl_object_translate_world(this._id, v[0], v[1], v[2]);
    return this;
  }
  /** @deprecated Please use {@link Object3D.rotateAxisAngleDegLocal} instead. */
  rotateAxisAngleDeg(a, d) {
    this.rotateAxisAngleDegLocal(a, d);
    return this;
  }
  /**
   * Rotate around given axis by given angle (degrees) in local space.
   *
   * @param a Vector representing the rotation axis.
   * @param d Angle in degrees.
   *
   * @note If the object is translated the rotation will be around
   *     the parent. To rotate around the object origin, use
   *     {@link rotateAxisAngleDegObject}
   *
   * @see {@link rotateAxisAngleRad}
   *
   * @returns Reference to self (for method chaining).
   */
  rotateAxisAngleDegLocal(a, d) {
    this._engine.wasm._wl_object_rotate_axis_angle(this._id, a[0], a[1], a[2], d);
    return this;
  }
  /** @deprecated Please use {@link Object3D.rotateAxisAngleRadLocal} instead. */
  rotateAxisAngleRad(a, d) {
    return this.rotateAxisAngleRadLocal(a, d);
  }
  /**
   * Rotate around given axis by given angle (radians) in local space.
   *
   * @param a Vector representing the rotation axis.
   * @param d Angle in radians.
   *
   * @note If the object is translated the rotation will be around
   *     the parent. To rotate around the object origin, use
   *     {@link rotateAxisAngleDegObject}
   *
   * @see {@link rotateAxisAngleDeg}
   *
   * @returns Reference to self (for method chaining).
   */
  rotateAxisAngleRadLocal(a, d) {
    this._engine.wasm._wl_object_rotate_axis_angle_rad(this._id, a[0], a[1], a[2], d);
    return this;
  }
  /**
   * Rotate around given axis by given angle (degrees) in object space.
   *
   * @param a Vector representing the rotation axis.
   * @param d Angle in degrees.
   *
   * Equivalent to prepending a rotation quaternion to the object's
   * local transformation.
   *
   * @see {@link rotateAxisAngleRadObject}
   *
   * @returns Reference to self (for method chaining).
   */
  rotateAxisAngleDegObject(a, d) {
    this._engine.wasm._wl_object_rotate_axis_angle_obj(this._id, a[0], a[1], a[2], d);
    return this;
  }
  /**
   * Rotate around given axis by given angle (radians) in object space
   * Equivalent to prepending a rotation quaternion to the object's
   * local transformation.
   *
   * @param a Vector representing the rotation axis
   * @param d Angle in degrees
   *
   * @see {@link rotateAxisAngleDegObject}
   *
   * @returns Reference to self (for method chaining).
   */
  rotateAxisAngleRadObject(a, d) {
    this._engine.wasm._wl_object_rotate_axis_angle_rad_obj(this._id, a[0], a[1], a[2], d);
    return this;
  }
  /** @deprecated Please use {@link Object3D.rotateLocal} instead. */
  rotate(q) {
    this.rotateLocal(q);
    return this;
  }
  /**
   * Rotate by a quaternion.
   *
   * @param q the Quaternion to rotate by.
   *
   * @returns Reference to self (for method chaining).
   */
  rotateLocal(q) {
    this._engine.wasm._wl_object_rotate_quat(this._id, q[0], q[1], q[2], q[3]);
    return this;
  }
  /**
   * Rotate by a quaternion in object space.
   *
   * Equivalent to prepending a rotation quaternion to the object's
   * local transformation.
   *
   * @param q the Quaternion to rotate by.
   *
   * @returns Reference to self (for method chaining).
   */
  rotateObject(q) {
    this._engine.wasm._wl_object_rotate_quat_obj(this._id, q[0], q[1], q[2], q[3]);
    return this;
  }
  /** @deprecated Please use {@link Object3D.scaleLocal} instead. */
  scale(v) {
    this.scaleLocal(v);
    return this;
  }
  /**
   * Scale object by a vector in object space.
   *
   * @param v Vector to scale by.
   *
   * @returns Reference to self (for method chaining).
   */
  scaleLocal(v) {
    this._engine.wasm._wl_object_scale(this._id, v[0], v[1], v[2]);
    return this;
  }
  getPositionLocal(out = new Float32Array(3)) {
    const wasm = this._engine.wasm;
    wasm._wl_object_get_translation_local(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  getTranslationLocal(out = new Float32Array(3)) {
    return this.getPositionLocal(out);
  }
  getPositionWorld(out = new Float32Array(3)) {
    const wasm = this._engine.wasm;
    wasm._wl_object_get_translation_world(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  getTranslationWorld(out = new Float32Array(3)) {
    return this.getPositionWorld(out);
  }
  /**
   * Set local / object space position.
   *
   * Concatenates a new translation dual quaternion onto the existing rotation.
   *
   * @param v New local position array/vector, expected to have at least 3 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setPositionLocal(v) {
    this._engine.wasm._wl_object_set_translation_local(this._id, v[0], v[1], v[2]);
    return this;
  }
  /** @deprecated Please use {@link Object3D.setPositionLocal} instead. */
  setTranslationLocal(v) {
    return this.setPositionLocal(v);
  }
  /**
   * Set world space position.
   *
   * Applies the inverse parent transform with a new translation dual quaternion
   * which is concatenated onto the existing rotation.
   *
   * @param v New world position array/vector, expected to have at least 3 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setPositionWorld(v) {
    this._engine.wasm._wl_object_set_translation_world(this._id, v[0], v[1], v[2]);
    return this;
  }
  /** @deprecated Please use {@link Object3D.setPositionWorld} instead. */
  setTranslationWorld(v) {
    return this.setPositionWorld(v);
  }
  getScalingLocal(out = new Float32Array(3)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_scaling_local(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    return out;
  }
  /**
   * Set local / object space scaling.
   *
   * @param v New local scaling array/vector, expected to have at least 3 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setScalingLocal(v) {
    this._engine.wasm._wl_object_set_scaling_local(this._id, v[0], v[1], v[2]);
    return this;
  }
  getScalingWorld(out = new Float32Array(3)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_scaling_world(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    return out;
  }
  /**
   * Set World space scaling.
   *
   * @param v New world scaling array/vector, expected to have at least 3 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setScalingWorld(v) {
    this._engine.wasm._wl_object_set_scaling_world(this._id, v[0], v[1], v[2]);
    return this;
  }
  getRotationLocal(out = new Float32Array(4)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_local(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    out[3] = wasm.HEAPF32[ptr + 3];
    return out;
  }
  /**
   * Set local space rotation.
   *
   * @param v New world rotation array/vector, expected to have at least 4 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setRotationLocal(v) {
    this._engine.wasm._wl_object_set_rotation_local(this._id, v[0], v[1], v[2], v[3]);
    return this;
  }
  getRotationWorld(out = new Float32Array(4)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_world(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    out[3] = wasm.HEAPF32[ptr + 3];
    return out;
  }
  /**
   * Set local space rotation.
   *
   * @param v New world rotation array/vector, expected to have at least 4 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setRotationWorld(v) {
    this._engine.wasm._wl_object_set_rotation_world(this._id, v[0], v[1], v[2], v[3]);
    return this;
  }
  getTransformLocal(out = new Float32Array(8)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_local(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    out[3] = wasm.HEAPF32[ptr + 3];
    out[4] = wasm.HEAPF32[ptr + 4];
    out[5] = wasm.HEAPF32[ptr + 5];
    out[6] = wasm.HEAPF32[ptr + 6];
    out[7] = wasm.HEAPF32[ptr + 7];
    return out;
  }
  /**
   * Set local space rotation.
   *
   * @param v New local transform array, expected to have at least 8 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setTransformLocal(v) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_local(this._id) / 4;
    wasm.HEAPF32[ptr] = v[0];
    wasm.HEAPF32[ptr + 1] = v[1];
    wasm.HEAPF32[ptr + 2] = v[2];
    wasm.HEAPF32[ptr + 3] = v[3];
    wasm.HEAPF32[ptr + 4] = v[4];
    wasm.HEAPF32[ptr + 5] = v[5];
    wasm.HEAPF32[ptr + 6] = v[6];
    wasm.HEAPF32[ptr + 7] = v[7];
    this.setDirty();
    return this;
  }
  getTransformWorld(out = new Float32Array(8)) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_world(this._id) / 4;
    out[0] = wasm.HEAPF32[ptr];
    out[1] = wasm.HEAPF32[ptr + 1];
    out[2] = wasm.HEAPF32[ptr + 2];
    out[3] = wasm.HEAPF32[ptr + 3];
    out[4] = wasm.HEAPF32[ptr + 4];
    out[5] = wasm.HEAPF32[ptr + 5];
    out[6] = wasm.HEAPF32[ptr + 6];
    out[7] = wasm.HEAPF32[ptr + 7];
    return out;
  }
  /**
   * Set world space rotation.
   *
   * @param v New world transform array, expected to have at least 8 elements.
   *
   * @returns Reference to self (for method chaining).
   */
  setTransformWorld(v) {
    const wasm = this._engine.wasm;
    const ptr = wasm._wl_object_trans_world(this._id) / 4;
    wasm.HEAPF32[ptr] = v[0];
    wasm.HEAPF32[ptr + 1] = v[1];
    wasm.HEAPF32[ptr + 2] = v[2];
    wasm.HEAPF32[ptr + 3] = v[3];
    wasm.HEAPF32[ptr + 4] = v[4];
    wasm.HEAPF32[ptr + 5] = v[5];
    wasm.HEAPF32[ptr + 6] = v[6];
    wasm.HEAPF32[ptr + 7] = v[7];
    this._engine.wasm._wl_object_trans_world_to_local(this._id);
    return this;
  }
  /**
   * Local space transformation.
   *
   * @deprecated Please use {@link Object3D.setTransformLocal} and
   * {@link Object3D.getTransformLocal} instead.
   */
  get transformLocal() {
    const wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_trans_local(this._id), 8);
  }
  /**
   * Set local transform.
   *
   * @param t Local space transformation.
   *
   * @since 0.8.5
   *
   * @deprecated Please use {@link Object3D.setTransformLocal} and
   * {@link Object3D.getTransformLocal} instead.
   */
  set transformLocal(t) {
    this.transformLocal.set(t);
    this.setDirty();
  }
  /**
   * Global / world space transformation.
   *
   * May recompute transformations of the hierarchy of this object,
   * if they were changed by JavaScript components this frame.
   *
   * @deprecated Please use {@link Object3D.setTransformWorld} and
   * {@link Object3D.getTransformWorld} instead.
   */
  get transformWorld() {
    const wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_trans_world(this._id), 8);
  }
  /**
   * Set world transform.
   *
   * @param t Global / world space transformation.
   *
   * @since 0.8.5
   *
   * @deprecated Please use {@link Object3D.setTransformWorld} and
   * {@link Object3D.getTransformWorld} instead.
   */
  set transformWorld(t) {
    this.transformWorld.set(t);
    this._engine.wasm._wl_object_trans_world_to_local(this._id);
  }
  /**
   * Local / object space scaling.
   *
   * @deprecated Please use {@link Object3D.setScalingLocal} and
   * {@link Object3D.getScalingLocal} instead.
   */
  get scalingLocal() {
    const wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_scaling_local(this._id), 3);
  }
  /**
   * Set local space scaling.
   *
   * @param s Local space scaling.
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.setScalingLocal} and
   * {@link Object3D.getScalingLocal} instead.
   */
  set scalingLocal(s) {
    this.scalingLocal.set(s);
    this.setDirty();
  }
  /**
   * Global / world space scaling.
   *
   * May recompute transformations of the hierarchy of this object,
   * if they were changed by JavaScript components this frame.
   *
   * @deprecated Please use {@link Object3D.setScalingWorld} and
   * {@link Object3D.getScalingWorld} instead.
   */
  get scalingWorld() {
    const wasm = this._engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_object_scaling_world(this._id), 3);
  }
  /**
   * Set world space scaling.
   *
   * @param t World space scaling.
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.setScalingWorld} and
   * {@link Object3D.getScalingWorld} instead.
   */
  set scalingWorld(s) {
    this.scalingWorld.set(s);
    this._engine.wasm._wl_object_scaling_world_to_local(this._id);
  }
  /**
   * Local space rotation.
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.getRotationLocal} and
   * {@link Object3D.setRotationLocal} instead.
   */
  get rotationLocal() {
    return this.transformLocal.subarray(0, 4);
  }
  /**
   * Global / world space rotation
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.getRotationWorld} and
   * {@link Object3D.setRotationWorld} instead.
   */
  get rotationWorld() {
    return this.transformWorld.subarray(0, 4);
  }
  /**
   * Set local space rotation.
   *
   * @param r Local space rotation
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.getRotationLocal} and
   * {@link Object3D.setRotationLocal} instead.
   */
  set rotationLocal(r) {
    this._engine.wasm._wl_object_set_rotation_local(this._id, r[0], r[1], r[2], r[3]);
  }
  /**
   * Set world space rotation.
   *
   * @param r Global / world space rotation.
   *
   * @since 0.8.7
   *
   * @deprecated Please use {@link Object3D.getRotationWorld} and
   * {@link Object3D.setRotationWorld} instead.
   */
  set rotationWorld(r) {
    this._engine.wasm._wl_object_set_rotation_world(this._id, r[0], r[1], r[2], r[3]);
  }
  /** @deprecated Please use {@link Object3D.getForwardWorld} instead. */
  getForward(out) {
    return this.getForwardWorld(out);
  }
  /**
   * Compute the object's forward facing world space vector.
   *
   * The forward vector in object space is along the negative z-axis, i.e.,
   * `[0, 0, -1]`.
   *
   * @param out Destination array/vector, expected to have at least 3 elements.
   * @return The `out` parameter.
   */
  getForwardWorld(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = -1;
    this.transformVectorWorld(out);
    return out;
  }
  /** @deprecated Please use {@link Object3D.getUpWorld} instead. */
  getUp(out) {
    return this.getUpWorld(out);
  }
  /**
   * Compute the object's up facing world space vector.
   *
   * @param out Destination array/vector, expected to have at least 3 elements.
   * @return The `out` parameter.
   */
  getUpWorld(out) {
    out[0] = 0;
    out[1] = 1;
    out[2] = 0;
    this.transformVectorWorld(out);
    return out;
  }
  /** @deprecated Please use {@link Object3D.getRightWorld} instead. */
  getRight(out) {
    return this.getRightWorld(out);
  }
  /**
   * Compute the object's right facing world space vector.
   *
   * @param out Destination array/vector, expected to have at least 3 elements.
   * @return The `out` parameter.
   */
  getRightWorld(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    this.transformVectorWorld(out);
    return out;
  }
  /**
   * Transform a vector by this object's world transform.
   *
   * @param out Out vector
   * @param v Vector to transform, default `out`
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformVectorWorld(out, v = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = v[0];
    wasm._tempMemFloat[1] = v[1];
    wasm._tempMemFloat[2] = v[2];
    wasm._wl_object_transformVectorWorld(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a vector by this object's local transform.
   *
   * @param out Out vector
   * @param v Vector to transform, default `out`
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformVectorLocal(out, v = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = v[0];
    wasm._tempMemFloat[1] = v[1];
    wasm._tempMemFloat[2] = v[2];
    wasm._wl_object_transformVectorLocal(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a point by this object's world transform.
   *
   * @param out Out point.
   * @param p Point to transform, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformPointWorld(out, p = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = p[0];
    wasm._tempMemFloat[1] = p[1];
    wasm._tempMemFloat[2] = p[2];
    wasm._wl_object_transformPointWorld(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a point by this object's local transform.
   *
   * @param out Out point.
   * @param p Point to transform, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformPointLocal(out, p = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = p[0];
    wasm._tempMemFloat[1] = p[1];
    wasm._tempMemFloat[2] = p[2];
    wasm._wl_object_transformPointLocal(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a vector by this object's inverse world transform.
   *
   * @param out Out vector.
   * @param v Vector to transform, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformVectorInverseWorld(out, v = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = v[0];
    wasm._tempMemFloat[1] = v[1];
    wasm._tempMemFloat[2] = v[2];
    wasm._wl_object_transformVectorInverseWorld(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a vector by this object's inverse local transform.
   *
   * @param out Out vector
   * @param v Vector to transform, default `out`
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformVectorInverseLocal(out, v = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = v[0];
    wasm._tempMemFloat[1] = v[1];
    wasm._tempMemFloat[2] = v[2];
    wasm._wl_object_transformVectorInverseLocal(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a point by this object's inverse world transform.
   *
   * @param out Out point.
   * @param p Point to transform, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformPointInverseWorld(out, p = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat[0] = p[0];
    wasm._tempMemFloat[1] = p[1];
    wasm._tempMemFloat[2] = p[2];
    wasm._wl_object_transformPointInverseWorld(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform a point by this object's inverse local transform.
   *
   * @param out Out point.
   * @param p Point to transform, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  transformPointInverseLocal(out, p = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat.set(p);
    wasm._wl_object_transformPointInverseLocal(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    return out;
  }
  /**
   * Transform an object space dual quaternion into world space.
   *
   * @param out Out transformation.
   * @param q Local space transformation, default `out`.
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  toWorldSpaceTransform(out, q = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat.set(q);
    wasm._wl_object_toWorldSpaceTransform(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    out[3] = wasm._tempMemFloat[3];
    out[4] = wasm._tempMemFloat[4];
    out[5] = wasm._tempMemFloat[5];
    out[6] = wasm._tempMemFloat[6];
    out[7] = wasm._tempMemFloat[7];
    return out;
  }
  /**
   * Transform a world space dual quaternion into local space.
   *
   * @param out Out transformation
   * @param q World space transformation, default `out`
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  toLocalSpaceTransform(out, q = out) {
    const p = this.parent;
    if (p) {
      p.toObjectSpaceTransform(out, q);
      return out;
    }
    if (out !== q) {
      out[0] = q[0];
      out[1] = q[1];
      out[2] = q[2];
      out[3] = q[3];
      out[4] = q[4];
      out[5] = q[5];
      out[6] = q[6];
      out[7] = q[7];
    }
    return out;
  }
  /**
   * Transform a world space dual quaternion into object space.
   *
   * @param out Out transformation.
   * @param q World space transformation, default `out`
   * @return The `out` parameter.
   *
   * @since 0.8.7
   */
  toObjectSpaceTransform(out, q = out) {
    const wasm = this._engine.wasm;
    wasm._tempMemFloat.set(q);
    wasm._wl_object_toObjectSpaceTransform(this._id, wasm._tempMem);
    out[0] = wasm._tempMemFloat[0];
    out[1] = wasm._tempMemFloat[1];
    out[2] = wasm._tempMemFloat[2];
    out[3] = wasm._tempMemFloat[3];
    out[4] = wasm._tempMemFloat[4];
    out[5] = wasm._tempMemFloat[5];
    out[6] = wasm._tempMemFloat[6];
    out[7] = wasm._tempMemFloat[7];
    return out;
  }
  /**
   * Turn towards / look at target.
   *
   * Rotates the object so that its forward vector faces towards the target
   * position. The `up` vector acts as a hint to uniquely orient the object's
   * up direction. When orienting a view component, the projected `up` vector
   * faces upwards on the viewing plane.
   *
   * @param p Target position to turn towards, in world space.
   * @param up Up vector to align object with, in world space. Default is `[0, 1, 0]`.
   *
   * @returns Reference to self (for method chaining).
   */
  lookAt(p, up = UP_VECTOR) {
    this._engine.wasm._wl_object_lookAt(this._id, p[0], p[1], p[2], up[0], up[1], up[2]);
    return this;
  }
  /** Destroy the object with all of its components and remove it from the scene */
  destroy() {
    if (this._id < 0)
      return;
    this.engine.wasm._wl_object_remove(this._id);
  }
  /**
   * Mark transformation dirty.
   *
   * Causes an eventual recalculation of {@link transformWorld}, either
   * on next {@link getTranslationWorld}, {@link transformWorld} or
   * {@link scalingWorld} or the beginning of next frame, whichever
   * happens first.
   */
  setDirty() {
    this._engine.wasm._wl_object_set_dirty(this._id);
  }
  /**
   * Disable/enable all components of this object.
   *
   * @param b New state for the components.
   *
   * @since 0.8.5
   */
  set active(b) {
    const comps = this.getComponents();
    for (let c of comps) {
      c.active = b;
    }
  }
  getComponent(typeOrClass, index = 0) {
    const wasm = this._engine.wasm;
    const type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
    const scene = this._scene;
    const componentType = wasm._wl_scene_get_component_manager_index(scene._index, wasm.tempUTF8(type));
    if (componentType < 0) {
      const typeIndex = wasm._componentTypeIndices[type];
      if (typeIndex === void 0)
        return null;
      const jsIndex = wasm._wl_get_js_component_index(this._id, typeIndex, index);
      if (jsIndex < 0)
        return null;
      const component = this._scene._jsComponents[jsIndex];
      return component.constructor !== BrokenComponent ? component : null;
    }
    const componentId = wasm._wl_get_component_id(this._id, componentType, index);
    return scene._components.wrapNative(componentType, componentId);
  }
  getComponents(typeOrClass) {
    const wasm = this._engine.wasm;
    const scene = this._scene;
    let manager = null;
    let type = null;
    if (typeOrClass) {
      type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
      const nativeManager = scene._components.getNativeManager(type);
      manager = nativeManager !== null ? nativeManager : scene._components.js;
    }
    const components = [];
    const maxComps = Math.floor(wasm._tempMemSize / 3 * 2);
    const componentsCount = wasm._wl_object_get_components(this._id, wasm._tempMem, maxComps);
    const offset2 = 2 * componentsCount;
    wasm._wl_object_get_component_types(this._id, wasm._tempMem + offset2, maxComps);
    for (let i = 0; i < componentsCount; ++i) {
      const t = wasm._tempMemUint8[i + offset2];
      const componentId = wasm._tempMemUint16[i];
      if (manager !== null && t !== manager)
        continue;
      const comp = this._scene._components.wrapAny(t, componentId);
      if (!comp)
        continue;
      if (type && type !== comp.constructor.TypeName)
        continue;
      components.push(comp);
    }
    return components;
  }
  addComponent(typeOrClass, params) {
    const wasm = this._engine.wasm;
    const type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
    const nativeManager = this._scene._components.getNativeManager(type);
    const isNative = nativeManager !== null;
    const manager = isNative ? nativeManager : this._scene._components.js;
    let componentId = -1;
    if (!isNative) {
      if (!(type in wasm._componentTypeIndices)) {
        throw new TypeError("Unknown component type '" + type + "'");
      }
      componentId = wasm._wl_object_add_js_component(this._id, wasm._componentTypeIndices[type]);
    } else {
      componentId = wasm._wl_object_add_component(this._id, manager);
    }
    const component = this._scene._components.wrapAny(manager, componentId);
    if (params !== void 0)
      component.copy(params);
    if (!isNative) {
      component._triggerInit();
    }
    if (!params || !("active" in params && !params.active)) {
      component.active = true;
    }
    return component;
  }
  /**
   * Search for descendants matching the name.
   *
   * This method is a wrapper around {@link Object3D.findByNameDirect} and
   * {@link Object3D.findByNameRecursive}.
   *
   * @param name The name to search for.
   * @param recursive If `true`, the method will look at all the descendants of this object.
   *     If `false`, this method will only perform the search in direct children.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.1.0
   */
  findByName(name, recursive = false) {
    return recursive ? this.findByNameRecursive(name) : this.findByNameDirect(name);
  }
  /**
   * Search for all **direct** children matching the name.
   *
   * @note Even though this method is heavily optimized, it does perform
   * a linear search to find the objects. Do not use in a hot path.
   *
   * @param name The name to search for.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.1.0
   */
  findByNameDirect(name) {
    const wasm = this._engine.wasm;
    const id = this._id;
    const tempSizeU16 = wasm._tempMemSize >> 2;
    const maxCount = tempSizeU16 - 2;
    const buffer = wasm._tempMemUint16;
    buffer[maxCount] = 0;
    buffer[maxCount + 1] = 0;
    const bufferPtr = wasm._tempMem;
    const indexPtr = bufferPtr + maxCount * 2;
    const childCountPtr = bufferPtr + maxCount * 2 + 2;
    const namePtr = wasm.tempUTF8(name, (maxCount + 2) * 2);
    const result = [];
    let read = 0;
    while (read = wasm._wl_object_findByName(id, namePtr, indexPtr, childCountPtr, bufferPtr, maxCount)) {
      for (let i = 0; i < read; ++i) {
        result.push(this._scene.wrap(buffer[i]));
      }
    }
    return result;
  }
  /**
   * Search for **all descendants** matching the name.
   *
   * @note Even though this method is heavily optimized, it does perform
   * a linear search to find the objects. Do not use in a hot path.
   *
   * @param name The name to search for.
   * @returns An array of {@link Object3D} matching the name.
   *
   * @since 1.1.0
   */
  findByNameRecursive(name) {
    const wasm = this._engine.wasm;
    const id = this._id;
    const tempSizeU16 = wasm._tempMemSize >> 2;
    const maxCount = tempSizeU16 - 1;
    const buffer = wasm._tempMemUint16;
    buffer[maxCount] = 0;
    const bufferPtr = wasm._tempMem;
    const indexPtr = bufferPtr + maxCount * 2;
    const namePtr = wasm.tempUTF8(name, (maxCount + 1) * 2);
    let read = 0;
    const result = [];
    while (read = wasm._wl_object_findByNameRecursive(id, namePtr, indexPtr, bufferPtr, maxCount)) {
      for (let i = 0; i < read; ++i) {
        result.push(this._scene.wrap(buffer[i]));
      }
    }
    return result;
  }
  /**
   * Whether given object's transformation has changed.
   */
  get changed() {
    return !!this._engine.wasm._wl_object_is_changed(this._id);
  }
  /**
   * `true` if the object is destroyed, `false` otherwise.
   *
   * If {@link WonderlandEngine.erasePrototypeOnDestroy} is `true`,
   * reading a custom property will not work:
   *
   * ```js
   * engine.erasePrototypeOnDestroy = true;
   *
   * const obj = scene.addObject();
   * obj.customParam = 'Hello World!';
   *
   * console.log(obj.isDestroyed); // Prints `false`
   * obj.destroy();
   * console.log(obj.isDestroyed); // Prints `true`
   * console.log(obj.customParam); // Throws an error
   * ```
   *
   * @since 1.1.1
   */
  get isDestroyed() {
    return this._id < 0;
  }
  /**
   * Checks equality by comparing ids and **not** the JavaScript reference.
   *
   * @deprecate Use JavaScript reference comparison instead:
   *
   * ```js
   * const objectA = scene.addObject();
   * const objectB = scene.addObject();
   * const objectC = objectB;
   * console.log(objectA === objectB); // false
   * console.log(objectA === objectA); // true
   * console.log(objectB === objectC); // true
   * ```
   */
  equals(otherObject) {
    if (!otherObject)
      return false;
    return this._id == otherObject._id;
  }
  toString() {
    if (this.isDestroyed) {
      return "Object3D(destroyed)";
    }
    return `Object3D('${this.name}', ${this._localId})`;
  }
};
var Skin = class extends SceneResource {
  /** Amount of joints in this skin. */
  get jointCount() {
    return this.engine.wasm._wl_skin_get_joint_count(this._id);
  }
  /** Joints object ids for this skin */
  get jointIds() {
    const wasm = this.engine.wasm;
    return new Uint16Array(wasm.HEAPU16.buffer, wasm._wl_skin_joint_ids(this._id), this.jointCount);
  }
  /**
   * Dual quaternions in a flat array of size 8 times {@link jointCount}.
   *
   * Inverse bind transforms of the skin.
   */
  get inverseBindTransforms() {
    const wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_skin_inverse_bind_transforms(this._id), 8 * this.jointCount);
  }
  /**
   * Vectors in a flat array of size 3 times {@link jointCount}.
   *
   * Inverse bind scalings of the skin.
   */
  get inverseBindScalings() {
    const wasm = this.engine.wasm;
    return new Float32Array(wasm.HEAPF32.buffer, wasm._wl_skin_inverse_bind_scalings(this._id), 3 * this.jointCount);
  }
};
var MorphTargets = class extends Resource {
  /** Amount of targets in this morph target set. */
  get count() {
    return this.engine.wasm._wl_morph_targets_get_target_count(this._id);
  }
  /** Returns the name of a given target */
  getTargetName(target) {
    if (target >= this.count) {
      throw new Error(`Index ${target} is out of bounds for ${this.count} targets`);
    }
    const wasm = this.engine.wasm;
    return wasm.UTF8ToString(wasm._wl_morph_targets_get_target_name(this._id, target));
  }
  /**
   * Get the index for a given target name.
   *
   * Throws if no target with that name exists.
   *
   * @param name Name of the target.
   */
  getTargetIndex(name) {
    const wasm = this.engine.wasm;
    const index = wasm._wl_morph_targets_get_target_index(this._id, wasm.tempUTF8(name));
    if (index === -1) {
      throw Error(`Missing target '${name}'`);
    }
    return index;
  }
};
var RayHit = class {
  /** Scene instance. @hidden */
  _scene;
  /** Pointer to the memory heap. */
  _ptr;
  /**
   * @param ptr Pointer to the ray hits memory.
   */
  constructor(scene, ptr) {
    if ((ptr & 3) !== 0) {
      throw new Error("Misaligned pointer: please report a bug");
    }
    this._scene = scene;
    this._ptr = ptr;
  }
  getLocations(out) {
    out = out ?? Array.from({ length: this.hitCount }, () => new Float32Array(3));
    const wasm = this.engine.wasm;
    const alignedPtr = this._ptr / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      const locationPtr = alignedPtr + 3 * i;
      out[i][0] = wasm.HEAPF32[locationPtr];
      out[i][1] = wasm.HEAPF32[locationPtr + 1];
      out[i][2] = wasm.HEAPF32[locationPtr + 2];
    }
    return out;
  }
  getNormals(out) {
    out = out ?? Array.from({ length: this.hitCount }, () => new Float32Array(3));
    const wasm = this.engine.wasm;
    const alignedPtr = (this._ptr + 48) / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      const normalPtr = alignedPtr + 3 * i;
      out[i][0] = wasm.HEAPF32[normalPtr];
      out[i][1] = wasm.HEAPF32[normalPtr + 1];
      out[i][2] = wasm.HEAPF32[normalPtr + 2];
    }
    return out;
  }
  getDistances(out = new Float32Array(this.hitCount)) {
    const wasm = this.engine.wasm;
    const alignedPtr = (this._ptr + 48 * 2) / 4;
    for (let i = 0; i < this.hitCount; ++i) {
      const distancePtr = alignedPtr + i;
      out[i] = wasm.HEAPF32[distancePtr];
    }
    return out;
  }
  /**
   * Array of hit objects.
   *
   * @param out Destination array/vector, expected to have at least `this.hitCount` elements.
   * @returns The `out` parameter.
   */
  getObjects(out = new Array(this.hitCount)) {
    const HEAPU16 = this.engine.wasm.HEAPU16;
    const alignedPtr = this._ptr + (48 * 2 + 16) >> 1;
    for (let i = 0; i < this.hitCount; ++i) {
      out[i] = this._scene.wrap(HEAPU16[alignedPtr + i]);
    }
    return out;
  }
  /** Hosting engine instance. */
  get engine() {
    return this._scene.engine;
  }
  /**
   * Equivalent to {@link RayHit.getLocations}.
   *
   * @note Prefer to use {@link RayHit.getLocations} for performance.
   */
  get locations() {
    return this.getLocations();
  }
  /**
   * Equivalent to {@link RayHit.getNormals}.
   *
   * @note Prefer to use {@link RayHit.getNormals} for performance.
   */
  get normals() {
    return this.getNormals();
  }
  /**
   * Equivalent to {@link RayHit.getDistances}.
   *
   * @note Prefer to use {@link RayHit.getDistances} for performance.
   */
  get distances() {
    return this.getDistances();
  }
  /**
   * Equivalent to {@link RayHit.getObjects}.
   *
   * @note Prefer to use {@link RayHit.getObjects} for performance.
   */
  get objects() {
    const objects = [null, null, null, null];
    return this.getObjects(objects);
  }
  /** Number of hits (max 4) */
  get hitCount() {
    return Math.min(this.engine.wasm.HEAPU32[this._ptr / 4 + 30], 4);
  }
};
var I18N = class {
  /**
   * {@link Emitter} for language change events.
   *
   * First parameter to a listener is the old language index,
   * second parameter is the new language index.
   *
   * Usage from a within a component:
   *
   * ```js
   * this.engine.i18n.onLanguageChanged.add((oldLanguageIndex, newLanguageIndex) => {
   *     const oldLanguage = this.engine.i18n.languageName(oldLanguageIndex);
   *     const newLanguage = this.engine.i18n.languageName(newLanguageIndex);
   *     console.log("Switched from", oldLanguage, "to", newLanguage);
   * });
   * ```
   */
  onLanguageChanged = new Emitter();
  /** Wonderland Engine instance. @hidden */
  _engine;
  /** Previously set language index. @hidden */
  _prevLanguageIndex = -1;
  /**
   * Constructor
   */
  constructor(engine2) {
    this._engine = engine2;
  }
  /**
   * Set current language and apply translations to linked text parameters.
   *
   * @note This is equivalent to {@link I18N.setLanguage}.
   *
   * @param code Language code to switch to
   */
  set language(code) {
    this.setLanguage(code);
  }
  /** Get current language code. */
  get language() {
    const wasm = this._engine.wasm;
    const code = wasm._wl_i18n_currentLanguage();
    if (code === 0)
      return null;
    return wasm.UTF8ToString(code);
  }
  /**
   * Get the current language index.
   *
   * This method is more efficient than its equivalent:
   *
   * ```js
   * const index = i18n.languageIndex(i18n.language);
   * ```
   */
  get currentIndex() {
    return this._engine.wasm._wl_i18n_currentLanguageIndex();
  }
  /** Previous language index. */
  get previousIndex() {
    return this._prevLanguageIndex;
  }
  /**
   * Set current language and apply translations to linked text parameters.
   *
   * @param code The language code.
   * @returns A promise that resolves with the current index code when the
   *     language is loaded.
   */
  async setLanguage(code) {
    if (code == null)
      return Promise.resolve(this.currentIndex);
    const wasm = this._engine.wasm;
    this._prevLanguageIndex = this.currentIndex;
    wasm._wl_i18n_setLanguage(wasm.tempUTF8(code));
    const scene = this.engine.scene;
    const filename = wasm.UTF8ToString(wasm._wl_i18n_languageFile(this.currentIndex));
    const url = `${scene.baseURL}/locale/${filename}`;
    await scene._downloadDependency(url);
    this.onLanguageChanged.notify(this._prevLanguageIndex, this.currentIndex);
    return this.currentIndex;
  }
  /**
   * Get translated string for a term for the currently loaded language.
   *
   * @param term Term to translate
   */
  translate(term) {
    const wasm = this._engine.wasm;
    const translation = wasm._wl_i18n_translate(wasm.tempUTF8(term));
    if (translation === 0)
      return null;
    return wasm.UTF8ToString(translation);
  }
  /**
   * Get the number of languages in the project.
   *
   */
  languageCount() {
    const wasm = this._engine.wasm;
    return wasm._wl_i18n_languageCount();
  }
  /**
   * Get a language code.
   *
   * @param index Index of the language to get the code from
   */
  languageIndex(code) {
    const wasm = this._engine.wasm;
    return wasm._wl_i18n_languageIndex(wasm.tempUTF8(code));
  }
  /**
   * Get a language code.
   *
   * @param index Index of the language to get the code from
   */
  languageCode(index) {
    const wasm = this._engine.wasm;
    const code = wasm._wl_i18n_languageCode(index);
    if (code === 0)
      return null;
    return wasm.UTF8ToString(code);
  }
  /**
   * Get a language name.
   *
   * @param index Index of the language to get the name from
   */
  languageName(index) {
    const wasm = this._engine.wasm;
    const name = wasm._wl_i18n_languageName(index);
    if (name === 0)
      return null;
    return wasm.UTF8ToString(name);
  }
  /** Hosting engine instance. */
  get engine() {
    return this._engine;
  }
};
var XR = class {
  /** Wonderland WASM bridge. @hidden */
  #wasm;
  #mode;
  constructor(wasm, mode) {
    this.#wasm = wasm;
    this.#mode = mode;
  }
  /** Current WebXR session mode */
  get sessionMode() {
    return this.#mode;
  }
  /** Current WebXR session */
  get session() {
    return this.#wasm.webxr_session;
  }
  /** Current WebXR frame */
  get frame() {
    return this.#wasm.webxr_frame;
  }
  referenceSpaceForType(type) {
    return this.#wasm.webxr_refSpaces[type] ?? null;
  }
  /** Set current reference space type used for retrieving eye, head, hand and joint poses */
  set currentReferenceSpace(refSpace) {
    this.#wasm.webxr_refSpace = refSpace;
    this.#wasm.webxr_refSpaceType = null;
    for (const type of Object.keys(this.#wasm.webxr_refSpaces)) {
      if (this.#wasm.webxr_refSpaces[type] === refSpace) {
        this.#wasm.webxr_refSpaceType = type;
      }
    }
  }
  /** Current reference space type used for retrieving eye, head, hand and joint poses */
  get currentReferenceSpace() {
    return this.#wasm.webxr_refSpace;
  }
  /** Current WebXR reference space type or `null` if not a default reference space */
  get currentReferenceSpaceType() {
    return this.#wasm.webxr_refSpaceType;
  }
  /** Current WebXR base layer  */
  get baseLayer() {
    return this.#wasm.webxr_baseLayer;
  }
  /** Current WebXR framebuffer */
  get framebuffers() {
    if (!Array.isArray(this.#wasm.webxr_fbo)) {
      return [this.#wasm.GL.framebuffers[this.#wasm.webxr_fbo]];
    }
    return this.#wasm.webxr_fbo.map((id) => this.#wasm.GL.framebuffers[id]);
  }
};

// node_modules/@wonderlandengine/api/dist/resources/material-manager.js
var MaterialParamType;
(function(MaterialParamType2) {
  MaterialParamType2[MaterialParamType2["UnsignedInt"] = 0] = "UnsignedInt";
  MaterialParamType2[MaterialParamType2["Int"] = 1] = "Int";
  MaterialParamType2[MaterialParamType2["HalfFloat"] = 2] = "HalfFloat";
  MaterialParamType2[MaterialParamType2["Float"] = 3] = "Float";
  MaterialParamType2[MaterialParamType2["Sampler"] = 4] = "Sampler";
  MaterialParamType2[MaterialParamType2["Font"] = 5] = "Font";
})(MaterialParamType || (MaterialParamType = {}));
var Material = class extends Resource {
  /**
   * @deprecated Use {@link MaterialManager#getTemplate} via {@link WonderlandEngine.materials}
   * to create a new material with a given pipeline:
   *
   * ```js
   * const PhongMaterial = engine.materials.getTemplate('Phong Opaque');
   * const material = new PhongMaterial();
   * material.setDiffuseColor([1, 0, 0]);
   * ```
   */
  constructor(engine2, params) {
    if (typeof params !== "number") {
      if (!params?.pipeline)
        throw new Error("Missing parameter 'pipeline'");
      const template = engine2.materials.getTemplate(params.pipeline);
      const material = new template();
      super(engine2, material._index);
      return material;
    }
    super(engine2, params);
  }
  /**
   * Check whether a parameter exists on this material.
   *
   * @param name The name to check.
   * @returns `true` if the parameter with name `name` exists on this material,
   *     `false` otherwise.
   */
  hasParameter(name) {
    const parameters = this.constructor.Parameters;
    return parameters && parameters.has(name);
  }
  /** @deprecated Use {@link pipeline} instead. */
  get shader() {
    return this.pipeline;
  }
  /** Name of the pipeline used by this material. */
  get pipeline() {
    const wasm = this.engine.wasm;
    return wasm.UTF8ToString(wasm._wl_material_get_pipeline(this._id));
  }
  /**
   * Create a copy of the underlying native material.
   *
   * @returns Material clone.
   */
  clone() {
    const index = this.engine.wasm._wl_material_clone(this._id);
    return this.engine.materials.wrap(index);
  }
  toString() {
    if (this.isDestroyed) {
      return "Material(destroyed)";
    }
    return `Material('${this.pipeline}', ${this._index})`;
  }
  /**
   * Wrap a native material index.
   *
   * @param engine Engine instance.
   * @param index The index.
   * @returns Material instance or `null` if index <= 0.
   *
   * @deprecated Use the {@link WonderlandEngine.materials} instead.
   */
  static wrap(engine2, index) {
    return engine2.materials.wrap(index);
  }
};
/** Proxy used to override prototypes of destroyed materials. */
__publicField(Material, "_destroyedPrototype", createDestroyedProxy2("material"));
var MaterialManager = class extends ResourceManager {
  /** Material classes. @hidden. */
  _materialTemplates = [];
  /** @hidden */
  constructor(engine2) {
    super(engine2, Material);
    this._cacheDefinitions();
  }
  /** @override */
  wrap(index) {
    if (index <= 0)
      return null;
    const cached = this._cache[index];
    if (cached)
      return cached;
    const wasm = this.engine.wasm;
    const definition = wasm._wl_material_get_definition(index);
    const Template = this._materialTemplates[definition];
    const material = new Template(index);
    return this._wrapInstance(material);
  }
  /**
   * Get the material class with the given pipeline name.
   *
   * #### Usage
   *
   * ```js
   * const PhongMaterial = engine.materials.getTemplate('Phong Opaque');
   * const material = new PhongMaterial();
   * material.setDiffuseColor([1.0, 0.0, 0.0, 1.0]);
   * ```
   *
   * @param pipeline The pipeline name to search for.
   * @returns The material class.
   *
   * @throws `Error` if the material class doesn't exist.
   */
  getTemplate(pipeline) {
    const wasm = this.engine.wasm;
    const index = wasm._wl_get_material_definition_index(wasm.tempUTF8(pipeline));
    if (!index) {
      throw new Error(`Pipeline '${pipeline}' doesn't exist in the scene`);
    }
    return this._materialTemplates[index];
  }
  /**
   * Wrap a material instance.
   *
   * @todo: Remove at 2.0.0.
   *
   * @note Wrapping should only be called once per instance.
   *
   * @param instance The material instance.
   * @returns The new material, wrapped in a proxy.
   */
  _wrapInstance(instance) {
    this._cache[instance.index] = instance;
    if (!this.engine.legacyMaterialSupport)
      return instance;
    const proxy = new Proxy(instance, {
      get(target, prop) {
        if (!target.hasParameter(prop)) {
          return target[prop];
        }
        const name = `get${capitalizeFirstUTF8(prop)}`;
        return target[name]();
      },
      set(target, prop, value) {
        if (!target.hasParameter(prop)) {
          target[prop] = value;
          return true;
        }
        const name = `set${capitalizeFirstUTF8(prop)}`;
        target[name](value);
        return true;
      }
    });
    this._cache[instance.index] = proxy;
    return proxy;
  }
  /**
   * Cache all pipeline definitions.
   *
   * @hidden
   */
  _cacheDefinitions() {
    const wasm = this.engine.wasm;
    const count = wasm._wl_get_material_definition_count();
    for (let i = 0; i < count; ++i) {
      this._materialTemplates[i] = this._createMaterialTemplate(i);
    }
  }
  /**
   * Create a material class from a definition index.
   *
   * @param wasm The WASM instance.
   * @param definitionIndex The definition index to wrap.
   * @returns The material class.
   */
  _createMaterialTemplate(definitionIndex) {
    const engine2 = this.engine;
    const template = class CustomMaterial extends Material {
      static Parameters = /* @__PURE__ */ new Set();
      constructor(index) {
        index = index ?? engine2.wasm._wl_material_create(definitionIndex);
        super(engine2, index);
        return engine2.materials._wrapInstance(this);
      }
    };
    const wasm = this.engine.wasm;
    const nbParams = wasm._wl_material_definition_get_param_count(definitionIndex);
    for (let index = 0; index < nbParams; ++index) {
      const name = wasm.UTF8ToString(wasm._wl_material_definition_get_param_name(definitionIndex, index));
      template.Parameters.add(name);
      const t = wasm._wl_material_definition_get_param_type(definitionIndex, index);
      const type = t & 255;
      const componentCount = t >> 8 & 255;
      const capitalized = capitalizeFirstUTF8(name);
      const getterId = `get${capitalized}`;
      const setterId = `set${capitalized}`;
      const templateProto = template.prototype;
      switch (type) {
        case MaterialParamType.UnsignedInt:
          templateProto[getterId] = uint32Getter(index, componentCount);
          templateProto[setterId] = uint32Setter(index);
          break;
        case MaterialParamType.Int:
          templateProto[getterId] = int32Getter(index, componentCount);
          templateProto[setterId] = uint32Setter(index);
          break;
        case MaterialParamType.HalfFloat:
        case MaterialParamType.Float:
          templateProto[getterId] = float32Getter(index, componentCount);
          templateProto[setterId] = float32Setter(index);
          break;
        case MaterialParamType.Sampler:
          templateProto[getterId] = samplerGetter(index);
          templateProto[setterId] = samplerSetter(index);
          break;
        case MaterialParamType.Font:
          templateProto[getterId] = fontGetter(index);
          break;
      }
    }
    return template;
  }
};
function uint32Getter(index, count) {
  if (count === 1) {
    return function() {
      const wasm = this.engine.wasm;
      wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
      return wasm._tempMemUint32[0];
    };
  }
  return function(out = new Uint32Array(count)) {
    const wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i) {
      out[i] = wasm._tempMemUint32[i];
    }
    return out;
  };
}
function uint32Setter(index) {
  return function(value) {
    const wasm = this.engine.wasm;
    wasm._wl_material_set_param_value_uint(this._id, index, value);
  };
}
function int32Getter(index, count) {
  if (count === 1) {
    return function() {
      const wasm = this.engine.wasm;
      wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
      return wasm._tempMemInt[0];
    };
  }
  return function(out = new Int32Array(count)) {
    const wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i) {
      out[i] = wasm._tempMemInt[i];
    }
    return out;
  };
}
function float32Getter(index, count) {
  if (count === 1) {
    return function() {
      const wasm = this.engine.wasm;
      wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
      return wasm._tempMemFloat[0];
    };
  }
  return function(out = new Float32Array(count)) {
    const wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    for (let i = 0; i < out.length; ++i) {
      out[i] = wasm._tempMemFloat[i];
    }
    return out;
  };
}
function float32Setter(index) {
  return function(value) {
    const wasm = this.engine.wasm;
    let count = 1;
    if (typeof value === "number") {
      wasm._tempMemFloat[0] = value;
    } else {
      count = value.length;
      for (let i = 0; i < count; ++i)
        wasm._tempMemFloat[i] = value[i];
    }
    wasm._wl_material_set_param_value_float(this._id, index, wasm._tempMem, count);
  };
}
function samplerGetter(index) {
  return function() {
    const wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    return this.engine.textures.wrap(wasm._tempMemInt[0]);
  };
}
function samplerSetter(index) {
  return function(value) {
    const wasm = this.engine.wasm;
    wasm._wl_material_set_param_value_uint(this._id, index, value._id);
  };
}
function fontGetter(index) {
  return function() {
    const wasm = this.engine.wasm;
    wasm._wl_material_get_param_value(this._id, index, wasm._tempMem);
    return this.engine.fonts.wrap(wasm._tempMemInt[0]);
  };
}

// node_modules/@wonderlandengine/api/dist/resources/mesh-manager.js
var MeshManager = class extends ResourceManager {
  constructor(engine2) {
    super(engine2, Mesh);
  }
  /**
   * Create a new mesh.
   *
   * @param params Vertex and index data. For more information, have a look
   *     at the {@link MeshParameters} object.
   */
  create(params) {
    if (!params.vertexCount)
      throw new Error("Missing parameter 'vertexCount'");
    const wasm = this.engine.wasm;
    let indexData = 0;
    let indexType = 0;
    let indexDataSize = 0;
    if (params.indexData) {
      indexType = params.indexType || MeshIndexType.UnsignedShort;
      indexDataSize = params.indexData.length * indexType;
      indexData = wasm._malloc(indexDataSize);
      switch (indexType) {
        case MeshIndexType.UnsignedByte:
          wasm.HEAPU8.set(params.indexData, indexData);
          break;
        case MeshIndexType.UnsignedShort:
          wasm.HEAPU16.set(params.indexData, indexData >> 1);
          break;
        case MeshIndexType.UnsignedInt:
          wasm.HEAPU32.set(params.indexData, indexData >> 2);
          break;
      }
    }
    const { skinningType = MeshSkinningType.None } = params;
    const index = wasm._wl_mesh_create(indexData, indexDataSize, indexType, params.vertexCount, skinningType);
    const instance = new Mesh(this._host, index);
    this._cache[instance.index] = instance;
    return instance;
  }
};

// node_modules/@wonderlandengine/api/dist/resources/texture-manager.js
var TextureManager = class extends ResourceManager {
  constructor(engine2) {
    super(engine2, Texture);
  }
  /**
   * Create a new texture from an image or video.
   *
   * #### Usage
   *
   * ```js
   * const img = new Image();
   * img.load = function(img) {
   *     const texture = engine.textures.create(img);
   * };
   * img.src = 'my-image.png';
   * ```
   *
   * @note The media must already be loaded. To automatically
   * load the media and create a texture, use {@link TextureManager.load} instead.
   *
   * @param image Media element to create the texture from.
   * @ret\urns The new texture with the media content.
   */
  create(image) {
    const wasm = this.engine.wasm;
    const jsImageIndex = wasm._images.length;
    wasm._images.push(image);
    if (image instanceof HTMLImageElement && !image.complete) {
      throw new Error("image must be ready to create a texture");
    }
    const width = image.videoWidth ?? image.width;
    const height = image.videoHeight ?? image.height;
    const imageIndex = wasm._wl_image_create(jsImageIndex, width, height);
    const index = wasm._wl_texture_create(imageIndex);
    const instance = new Texture(this.engine, index);
    this._cache[instance.index] = instance;
    return instance;
  }
  /**
   * Load an image from URL as {@link Texture}.
   *
   * #### Usage
   *
   * ```js
   * const texture = await engine.textures.load('my-image.png');
   * ```
   *
   * @param filename URL to load from.
   * @param crossOrigin Cross origin flag for the image object.
   * @returns Loaded texture.
   */
  load(filename, crossOrigin) {
    let image = new Image();
    image.crossOrigin = crossOrigin ?? image.crossOrigin;
    image.src = filename;
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(this.create(image));
      };
      image.onerror = function() {
        reject("Failed to load image. Not found or no read access");
      };
    });
  }
};

// node_modules/@wonderlandengine/api/dist/scene-gltf.js
var GLTFExtensions = class {
  objectCount;
  /** glTF root extensions object. JSON data indexed by extension name. */
  root = {};
  /**
   * Mesh extension objects. Key is the gltf index, value is JSON
   * data indexed by extension name.
   */
  mesh = {};
  /**
   * Node extension objects. Key is a glTF index, value is JSON
   * data indexed by extension name.
   */
  node = {};
  constructor(count) {
    this.objectCount = count;
  }
};
var PrefabGLTF = class extends Prefab {
  /**
   * Raw extensions read from the glTF file.
   *
   * The extensions will be mapped to the hierarchy upon instantiation.
   * For more information, have a look at the {@link InstantiateGltfResult} type.
   *
   * @note The glTF must be loaded with `extensions` enabled. If not, this
   * field will be set to `null`. For more information, have a look at the
   * {@link GLTFOptions} type.
   */
  extensions = null;
  /**
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  constructor(engine2, index) {
    super(engine2, index);
    this.extensions = this._readExtensions();
  }
  /**
   * Instantiate the glTF extensions on an active sub scene graph.
   *
   * @param id The root object id.
   * @param result The instantiation object result.
   *
   * @hidden
   */
  _processInstantiaton(dest, root, result) {
    if (!this.extensions)
      return null;
    const wasm = this.engine.wasm;
    const count = this.extensions.objectCount;
    const idMapping = new Array(count);
    const activeRootIndex = wasm._wl_object_index(root._id);
    for (let i = 0; i < count; ++i) {
      const mappedId = wasm._wl_glTF_scene_extensions_gltfIndex_to_id(this._index, dest._index, activeRootIndex, i);
      idMapping[i] = mappedId;
    }
    const remapped = {
      mesh: {},
      node: {},
      idMapping
    };
    for (const gltfIndex in this.extensions.mesh) {
      const id = idMapping[gltfIndex];
      remapped.mesh[id] = this.extensions.mesh[gltfIndex];
    }
    for (const gltfIndex in this.extensions.node) {
      const id = idMapping[gltfIndex];
      remapped.node[id] = this.extensions.node[gltfIndex];
    }
    result.extensions = remapped;
  }
  /**
   * Unmarshalls gltf extensions.
   *
   * @hidden
   */
  _readExtensions() {
    const wasm = this.engine.wasm;
    const ptr = wasm._wl_glTF_scene_get_extensions(this._index);
    if (!ptr)
      return null;
    let index = ptr / 4;
    const data = wasm.HEAPU32;
    const readString = () => {
      const strPtr = data[index++];
      const strLen = data[index++];
      return wasm.UTF8ViewToString(strPtr, strPtr + strLen);
    };
    const objectCount = data[index++];
    const extensions = new GLTFExtensions(objectCount);
    const meshExtensionsSize = data[index++];
    for (let i = 0; i < meshExtensionsSize; ++i) {
      const objectId = data[index++];
      extensions.mesh[objectId] = JSON.parse(readString());
    }
    const nodeExtensionsSize = data[index++];
    for (let i = 0; i < nodeExtensionsSize; ++i) {
      const objectId = data[index++];
      extensions.node[objectId] = JSON.parse(readString());
    }
    const rootExtensionsStr = readString();
    if (rootExtensionsStr) {
      extensions.root = JSON.parse(rootExtensionsStr);
    }
    return extensions;
  }
};

// node_modules/@wonderlandengine/api/dist/scene.js
var MAGIC_BIN = "WLEV";
var SceneType;
(function(SceneType2) {
  SceneType2[SceneType2["Prefab"] = 0] = "Prefab";
  SceneType2[SceneType2["Main"] = 1] = "Main";
  SceneType2[SceneType2["Dependency"] = 2] = "Dependency";
})(SceneType || (SceneType = {}));
var ChunkedSceneLoadSink = class {
  #wasm;
  #type;
  #closeParameters;
  #offset = 0;
  #requested = 0;
  #firstChunk = true;
  _buffer = new Uint8Array();
  _loadIndex = -1;
  sceneIndex = -1;
  /**
   * Constructor
   * @param engine Engine instance
   * @param type Type of scene to load
   * @param url URL for the scene creation. Can be empty.
   * @param closeParameters Parameters for the final function to be called
   *     during a successful {@link ChunkedSceneLoadSink.close}.
   */
  constructor(engine2, type, url, ...closeParameters) {
    this.#wasm = engine2.wasm;
    this.#type = type;
    this.#closeParameters = closeParameters;
    this._loadIndex = this.#wasm._wl_scene_create_chunked_start(this.#wasm.tempUTF8(url));
    this.#requested = this.#wasm._wl_scene_create_chunked_buffer_size(this._loadIndex);
    this._resizeBuffer(this.#requested);
  }
  _resizeBuffer(size) {
    if (this._buffer.length > 0) {
      this.#wasm._free(this._buffer.byteOffset);
    }
    if (size > 0) {
      const ptr = this.#wasm._malloc(size);
      this._buffer = new Uint8Array(this.#wasm.HEAPU8.buffer, ptr, size);
    } else {
      this._buffer = new Uint8Array();
    }
  }
  _throwError(reason) {
    this.abort();
    throw new Error(reason);
  }
  /**
   * Write a single blob of data.
   *
   * @param blob Data to parse
   */
  write(blob) {
    let read = 0;
    while (read < blob.length) {
      const toRead = Math.min(blob.length - read, this._buffer.length - this.#offset);
      this._buffer.set(blob.subarray(read, read + toRead), this.#offset);
      this.#offset += toRead;
      read += toRead;
      if (this.#requested > this.#offset)
        continue;
      const readPtr = this.#wasm._tempMem;
      const sizePtr = this.#wasm._tempMem + 4;
      let success;
      try {
        success = this.#wasm._wl_scene_create_chunked_next(this._loadIndex, this._buffer.byteOffset, this.#offset, readPtr, sizePtr);
      } catch {
        success = false;
      }
      if (!success) {
        this._throwError("Chunk parsing failed");
      }
      const readSize = this.#wasm._tempMemUint32[0];
      this.#requested = this.#wasm._tempMemUint32[1];
      if (this.#requested > this.#offset)
        continue;
      if (this.#offset - readSize > this.#requested) {
        this._throwError("Unexpected extra data");
      }
      if (readSize < this.#offset) {
        this._buffer.copyWithin(0, readSize, this.#offset);
        this.#offset -= readSize;
      } else {
        this.#offset = 0;
      }
      if (this.#firstChunk) {
        this._resizeBuffer(this.#wasm._wl_scene_create_chunked_buffer_size(this._loadIndex));
        this.#firstChunk = false;
      }
    }
  }
  /** Called when all blobs of data have been written */
  close() {
    if (this.#requested > 0) {
      this._throwError("Unexpected end of data");
    }
    this._resizeBuffer(0);
    switch (this.#type) {
      case SceneType.Prefab:
        this.sceneIndex = this.#wasm._wl_scene_create_chunked_end_prefab(this._loadIndex);
        break;
      case SceneType.Main:
        this.#wasm._wl_scene_create_chunked_end_main(this._loadIndex);
        this.sceneIndex = 0;
        break;
      case SceneType.Dependency:
        [this.sceneIndex] = this.#closeParameters;
        this.#wasm._wl_scene_create_chunked_end_queued(this._loadIndex, this.sceneIndex);
        break;
      default:
        this.#wasm._wl_scene_create_chunked_abort(this._loadIndex);
        break;
    }
    this._loadIndex = -1;
  }
  /** Called when the stream is aborted */
  abort() {
    if (this._loadIndex === -1)
      return;
    this.#wasm._wl_scene_create_chunked_abort(this._loadIndex);
    this._loadIndex = -1;
    this._resizeBuffer(0);
  }
};
var Scene = class extends Prefab {
  /** Called before rendering the scene */
  onPreRender = new Emitter();
  /** Called after the scene has been rendered */
  onPostRender = new Emitter();
  /** Ray hit pointer in WASM heap. @hidden */
  _rayHit;
  /** Ray hit. @hidden */
  _hit;
  constructor(engine2, index) {
    super(engine2, index);
    this._rayHit = this.engine?.wasm._malloc(4 * (3 * 4 + 3 * 4 + 4 + 2) + 4);
    this._hit = new RayHit(this, this._rayHit);
  }
  instantiate(prefab) {
    const wasm = this.engine.wasm;
    const id = wasm._wl_scene_instantiate(prefab._index, this._index);
    const result = { root: this.wrap(id) };
    if (prefab instanceof PrefabGLTF) {
      const obj = this.wrap(id);
      prefab._processInstantiaton(this, obj, result);
    }
    return result;
  }
  /** @todo: Add `instantiateBatch` to instantiate multiple chunks in a row. */
  /**
   * @todo Provide an API to delete all resources linked to a scene.
   *
   * Example:
   *
   * ```ts
   * const scene = await engine.loadScene('Scene.bin');
   * ...
   * scene.destroy({removeResources: true});
   * ```
   */
  /**
   * Destroy this scene and remove it from the engine.
   *
   * @note Destroying a scene **doesn't** remove the materials, meshes,
   * and textures it references in the engine. Those should be cleaned up either by loading
   * another main scene via {@link WonderlandEngine.loadMainScene}, or manually using {@link Mesh.destroy}.
   *
   * @throws If the scene is currently active.
   * */
  destroy() {
    if (this.isActive) {
      throw new Error(`Attempt to destroy ${this}, but destroying the active scene is not supported`);
    }
    const wasm = this.engine.wasm;
    const rayPtr = this._rayHit;
    super.destroy();
    wasm._free(rayPtr);
  }
  /**
   * Currently active view components.
   */
  get activeViews() {
    const wasm = this.engine.wasm;
    const count = wasm._wl_scene_get_active_views(this._index, wasm._tempMem, 16);
    const views = [];
    for (let i = 0; i < count; ++i) {
      const id = wasm._tempMemInt[i];
      views.push(this._components.wrapView(id));
    }
    return views;
  }
  /**
   * Cast a ray through the scene and find intersecting collision components.
   *
   * The resulting ray hit will contain **up to 4** closest ray hits,
   * sorted by increasing distance.
   *
   * Example:
   *
   * ```js
   * const hit = engine.scene.rayCast(
   *     [0, 0, 0],
   *     [0, 0, 1],
   *     1 << 0 | 1 << 4, // Only check against components in groups 0 and 4
   *     25
   * );
   * if (hit.hitCount > 0) {
   *     const locations = hit.getLocations();
   *     console.log(`Object hit at: ${locations[0][0]}, ${locations[0][1]}, ${locations[0][2]}`);
   * }
   * ```
   *
   * @param o Ray origin.
   * @param d Ray direction.
   * @param groupMask Bitmask of collision groups to filter by: only objects
   *        that are part of given groups are considered for the raycast.
   * @param maxDistance Maximum **inclusive** hit distance. Defaults to `100`.
   *
   * @returns The {@link RayHit} instance, cached by this class.
   *
   * @note The returned {@link RayHit} object is owned by the {@link Scene}
   *       instance and will be reused with the next {@link Scene#rayCast} call.
   */
  rayCast(o, d, groupMask, maxDistance = 100) {
    this.engine.wasm._wl_scene_ray_cast(this._index, o[0], o[1], o[2], d[0], d[1], d[2], groupMask, this._rayHit, maxDistance);
    return this._hit;
  }
  /**
   * Set the background clear color.
   *
   * @param color new clear color (RGBA).
   * @since 0.8.5
   */
  set clearColor(color) {
    this.engine.wasm._wl_scene_set_clearColor(color[0], color[1], color[2], color[3]);
  }
  /**
   * Set whether to clear the color framebuffer before drawing.
   *
   * This function is useful if an external framework (e.g. an AR tracking
   * framework) is responsible for drawing a camera frame before Wonderland
   * Engine draws the scene on top of it.
   *
   * @param b Whether to enable color clear.
   * @since 0.9.4
   */
  set colorClearEnabled(b) {
    this.engine.wasm._wl_scene_enableColorClear(b);
  }
  /**
   * Load a scene file (.bin).
   *
   * Will replace the currently active scene with the one loaded
   * from given file. It is assumed that JavaScript components required by
   * the new scene were registered in advance.
   *
   * Once the scene is loaded successfully and initialized,
   * {@link WonderlandEngine.onSceneLoaded} is notified.
   *
   * #### ArrayBuffer
   *
   * The `load()` method accepts an in-memory buffer:
   *
   * ```js
   * scene.load({
   *     buffer: new ArrayBuffer(...),
   *     baseURL: 'https://my-website/assets'
   * })
   * ```
   *
   * @note The `baseURL` is mandatory. It's used to fetch images and languages.
   *
   * Use {@link Scene.setLoadingProgress} to update the loading progress bar
   * when using an ArrayBuffer.
   *
   * @deprecated Use the new {@link WonderlandEngine.loadMainScene} API.
   *
   * @param options Path to the file to load, or an option object.
   *     For more information about the options, see the {@link SceneLoadOptions} documentation.
   * @returns Promise that resolves when the scene was loaded.
   */
  async load(options) {
    let dispatchReadyEvent = false;
    let opts;
    if (isString(options)) {
      opts = await Scene.loadBuffer(options, (bytes, size) => {
        this.engine.log.info(LogTag.Scene, `Scene downloading: ${bytes} / ${size}`);
        this.engine.setLoadingProgress(bytes / size);
      });
    } else {
      opts = options;
      dispatchReadyEvent = options.dispatchReadyEvent ?? false;
    }
    const scene = await this.engine.loadMainSceneFromBuffer({
      ...opts,
      dispatchReadyEvent
    });
    this.engine.onSceneLoaded.notify();
    return scene;
  }
  /**
   * Append a scene file.
   *
   * Loads and parses the file and its images and appends the result
   * to the currently active scene.
   *
   * Supported formats are streamable Wonderland scene files (.bin) and glTF
   * 3D scenes (.gltf, .glb).
   *
   * ```js
   * WL.scene.append(filename).then(root => {
   *     // root contains the loaded scene
   * });
   * ```
   *
   * In case the `loadGltfExtensions` option is set to true, the response
   * will be an object containing both the root of the loaded scene and
   * any glTF extensions found on nodes, meshes and the root of the file.
   *
   * ```js
   * WL.scene.append(filename, { loadGltfExtensions: true }).then(({root, extensions}) => {
   *     // root contains the loaded scene
   *     // extensions.root contains any extensions at the root of glTF document
   *     const rootExtensions = extensions.root;
   *     // extensions.mesh and extensions.node contain extensions indexed by Object id
   *     const childObject = root.children[0];
   *     const meshExtensions = root.meshExtensions[childObject.objectId];
   *     const nodeExtensions = root.nodeExtensions[childObject.objectId];
   *     // extensions.idMapping contains a mapping from glTF node index to Object id
   * });
   * ```
   *
   * If the file to be loaded is located in a subfolder, it might be useful
   * to define the `baseURL` option. This will ensure any bin files
   * referenced by the loaded bin file are loaded at the correct path.
   *
   * ```js
   * WL.scene.append(filename, { baseURL: 'scenes' }).then(({root, extensions}) => {
   *     // do stuff
   * });
   * ```
   *
   * @deprecated Use the new {@link Prefab} and {@link Scene} API.
   *
   * @param file The .bin, .gltf or .glb file to append. Should be a URL or
   *   an `ArrayBuffer` with the file content.
   * @param options Additional options for loading.
   * @returns Promise that resolves when the scene was appended.
   */
  async append(file, options = {}) {
    const { baseURL = isString(file) ? getBaseUrl(file) : this.baseURL } = options;
    const buffer = isString(file) ? await fetchWithProgress(file) : file;
    const data = new Uint8Array(buffer);
    const isBinFile = data.byteLength > MAGIC_BIN.length && data.subarray(0, MAGIC_BIN.length).every((value, i) => value === MAGIC_BIN.charCodeAt(i));
    const scene = isBinFile ? this.engine.loadPrefabFromBuffer({ buffer, baseURL }) : this.engine.loadGLTFFromBuffer({
      buffer,
      baseURL,
      extensions: options.loadGltfExtensions
    });
    const result = this.instantiate(scene);
    if (scene instanceof PrefabGLTF) {
      if (!scene.extensions)
        return result.root;
      return {
        root: result.root,
        extensions: {
          ...result.extensions,
          root: scene.extensions.root
        }
      };
    }
    return result.root;
  }
  /**
   * Update the loading screen progress bar.
   *
   * @param value Current loading percentage, in the range [0; 1].
   *
   * @deprecated Use {@link WonderlandEngine.setLoadingProgress}.
   */
  setLoadingProgress(percentage) {
    this.engine.setLoadingProgress(percentage);
  }
  /**
   * Dispatch an event 'wle-scene-ready' in the document.
   *
   * @note This is used for automatic testing.
   */
  dispatchReadyEvent() {
    document.dispatchEvent(new CustomEvent("wle-scene-ready", {
      detail: { filename: this.filename }
    }));
  }
  /**
   * Set the current material to render the sky.
   *
   * @note The sky needs to be enabled in the editor when creating the scene.
   * For more information, please refer to the background [tutorial](https://wonderlandengine.com/tutorials/background-effect/).
   */
  set skyMaterial(material) {
    this.engine.wasm._wl_scene_set_sky_material(this._index, material?._id ?? 0);
  }
  /** Current sky material, or `null` if no sky is set. */
  get skyMaterial() {
    const index = this.engine.wasm._wl_scene_get_sky_material(this._index);
    return this.engine.materials.wrap(index);
  }
  /**
   * Reset the scene.
   *
   * This method deletes all used and allocated objects, and components.
   *
   * @deprecated Load a new scene and activate it instead.
   */
  reset() {
  }
  /**
   * Download and apply queued dependency files (.bin).
   *
   * @hidden
   */
  async _downloadDependency(url) {
    const wasm = this.engine.wasm;
    const buffer = await fetchWithProgress(url);
    const loadChunked = this.engine.runtimeVersion.minor > 2 || this.engine.runtimeVersion.patch >= 1;
    if (loadChunked) {
      const sink = new ChunkedSceneLoadSink(this.engine, SceneType.Dependency, url, this._index);
      sink.write(new Uint8Array(buffer));
      sink.close();
    } else {
      const ptr = wasm.copyBufferToHeap(buffer);
      try {
        wasm._wl_scene_load_queued_bin(this._index, ptr, buffer.byteLength);
      } finally {
        wasm._free(ptr);
      }
    }
  }
  /**
   * Download and apply queued dependency files (.bin).
   *
   * @hidden
   */
  async _downloadDependencies() {
    const wasm = this.engine.wasm;
    const count = wasm._wl_scene_queued_bin_count(this._index);
    if (!count)
      return Promise.resolve();
    const urls = new Array(count).fill(0).map((_, i) => {
      const ptr = wasm._wl_scene_queued_bin_path(this._index, i);
      const url = wasm.UTF8ToString(ptr);
      return url;
    });
    wasm._wl_scene_clear_queued_bin_list(this._index);
    return Promise.all(urls.map((url) => this._downloadDependency(url)));
  }
};

// node_modules/@wonderlandengine/api/dist/engine.js
function checkXRSupport() {
  if (!navigator.xr) {
    const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    const missingHTTPS = location.protocol !== "https:" && !isLocalhost;
    return Promise.reject(missingHTTPS ? "WebXR is only supported with HTTPS or on localhost!" : "WebXR unsupported in this browser.");
  }
  return Promise.resolve();
}
var WonderlandEngine = class {
  /**
   * {@link Emitter} for WebXR session end events.
   *
   * Usage from within a component:
   *
   * ```js
   * this.engine.onXRSessionEnd.add(() => console.log("XR session ended."));
   * ```
   */
  onXRSessionEnd = new Emitter();
  /**
   * {@link RetainEmitter} for WebXR session start events.
   *
   * Usage from within a component:
   *
   * ```js
   * this.engine.onXRSessionStart.add((session, mode) => console.log(session, mode));
   * ```
   *
   * By default, this emitter is retained and will automatically call any callback added
   * while a session is already started:
   *
   * ```js
   * // XR session is already active.
   * this.engine.onXRSessionStart.add((session, mode) => {
   *     console.log(session, mode); // Triggered immediately.
   * });
   * ```
   */
  onXRSessionStart = new RetainEmitter();
  /**
   * {@link Emitter} for canvas / main framebuffer resize events.
   *
   * Usage from within a component:
   *
   * ```js
   * this.engine.onResize.add(() => {
   *     const canvas = this.engine.canvas;
   *     console.log(`New Size: ${canvas.width}, ${canvas.height}`);
   * });
   * ```
   *
   * @note The size of the canvas is in physical pixels, and is set via {@link WonderlandEngine.resize}.
   */
  onResize = new Emitter();
  /** Whether AR is supported by the browser. */
  arSupported = false;
  /** Whether VR is supported by the browser. */
  vrSupported = false;
  /**
   * {@link RetainEmitter} signalling the end of the loading screen.
   *
   * Listeners get notified when the first call to {@link Scene#load()} is
   * invoked. At this point the new scene has not become active, and none of
   * its resources or components are initialized.
   *
   * Compared to {@link onSceneLoaded}, this does not wait for all components
   * to be fully initialized and activated. Any handler added inside
   * {@link Component#init()}, {@link Component#start()} or
   * {@link Component#onActivate()} will be called immediately.
   *
   * Usage:
   *
   * ```js
   * this.engine.onLoadingScreenEnd.add(() => console.log("Wait is over!"));
   * ```
   */
  onLoadingScreenEnd = new RetainEmitter();
  /**
   * {@link Emitter} for scene loaded events.
   *
   * Listeners get notified when a call to {@link Scene#load()} finishes. At
   * this point all resources are loaded and all components had their
   * {@link Component#init()} as well as (if active)
   * {@link Component#start()} and {@link Component#onActivate()} methods
   * called.
   *
   * Usage from within a component:
   *
   * ```js
   * this.engine.onSceneLoaded.add(() => console.log("Scene switched!"));
   * ```
   *
   * @deprecated Use {@link onSceneActivated} instead.
   */
  onSceneLoaded = new Emitter();
  /**
   * {@link Emitter} for scene activated events.
   *
   * This listener is notified with the old scene as first parameter, and
   * the new scene as second.
   *
   * This listener is notified after all resources are loaded and all components had their
   * {@link Component#init()} as well as (if active)
   * {@link Component#start()} and {@link Component#onActivate()} methods
   * called.
   *
   * Usage from within a component:
   *
   * ```js
   * this.engine.onSceneActivated.add((oldScene, newScene) => {
   *     console.log(`Scene switch from ${oldScene.filename} to ${newScene.filename}`);
   * });
   * ```
   */
  onSceneActivated = new Emitter();
  /**
   * Access to internationalization.
   */
  i18n = new I18N(this);
  /**
   * WebXR related state, `null` if no XR session is active.
   */
  xr = null;
  /**
   * If `true`, {@link Texture}, {@link Object3D}, and {@link Component}
   * instances have their prototype erased upon destruction.
   *
   * #### Object
   *
   * ```js
   * engine.erasePrototypeOnDestroy = true;
   *
   * const obj = engine.scene.addObject();
   * obj.name = 'iamalive';
   * console.log(obj.name); // Prints 'iamalive'
   *
   * obj.destroy();
   * console.log(obj.name); // Throws an error
   * ```
   *
   * #### Component
   *
   * Components will also be affected:
   *
   * ```js
   * class MyComponent extends Component {
   *     static TypeName = 'my-component';
   *     static Properties = {
   *         alive: Property.bool(true)
   *     };
   *
   *     start() {
   *         this.destroy();
   *         console.log(this.alive) // Throws an error
   *     }
   * }
   * ```
   *
   * A component is also destroyed if its ancestor gets destroyed:
   *
   * ```js
   * class MyComponent extends Component {
   *     ...
   *     start() {
   *         this.object.parent.destroy();
   *         console.log(this.alive) // Throws an error
   *     }
   * }
   * ```
   *
   * @note Native components will not be erased if destroyed via object destruction:
   *
   * ```js
   * const mesh = obj.addComponent('mesh');
   * obj.destroy();
   * console.log(mesh.active) // Doesn't throw even if the mesh is destroyed
   * ```
   *
   * @since 1.1.1
   */
  erasePrototypeOnDestroy = false;
  /**
   * If `true`, the materials will be wrapped in a proxy to support pre-1.2.0
   * material access, i.e.,
   *
   * ```js
   * const material = new Material(engine, 'Phong Opaque');
   * material.diffuseColor = [1.0, 0.0, 0.0, 1.0];
   * ```
   *
   * If `false`, property accessors will not be available and material
   * properties should be accessed via methods, i.e.,
   *
   * ```js
   * const PhongOpaque = engine.materials.getTemplate('Phong Opaque');
   * const material = new PhongOpaque();
   * material.setDiffuseColor([1.0, 0.0, 0.0, 1.0]);
   * ...
   * const diffuse = material.getDiffuseColor();
   * ```
   *
   * When disabled, reading/writing to materials is slightly more efficient on the CPU.
   */
  legacyMaterialSupport = true;
  /**
   * Scene cache in scene manager.
   *
   * @hidden
   */
  _scenes = [];
  /**
   * Currently active scene.
   *
   * @hidden
   */
  _scene = null;
  /** @hidden */
  _textures = null;
  /** @hidden */
  _materials = null;
  /** @hidden */
  _meshes = null;
  /** @hidden */
  _morphTargets = null;
  /** @hidden */
  _fonts = null;
  /**
   * WebAssembly bridge.
   *
   * @hidden
   */
  #wasm;
  /**
   * Physics manager, only available when physx is enabled in the runtime.
   *
   * @hidden
   */
  #physics = null;
  /**
   * Resize observer to track for canvas size changes.
   *
   * @hidden
   */
  #resizeObserver = null;
  /**
   * Initial reference space type set by webxr_init. See {@link _init} for
   * more information.
   *
   * @hidden
   */
  #initialReferenceSpaceType = null;
  /**
   * Create a new engine instance.
   *
   * @param wasm Wasm bridge instance
   * @param loadingScreen Loading screen .bin file data
   *
   * @hidden
   */
  constructor(wasm, loadingScreen) {
    this.#wasm = wasm;
    this.#wasm["_setEngine"](this);
    this.#wasm._loadingScreen = loadingScreen;
    this.canvas.addEventListener("webglcontextlost", (e) => this.log.error(LogTag.Engine, "Context lost:", e), false);
  }
  /**
   * Start the engine if it's not already running.
   *
   * When using the {@link loadRuntime} function, this method is called
   * automatically.
   */
  start() {
    this.wasm._wl_application_start();
  }
  /**
   * Register a custom JavaScript component type.
   *
   * You can register a component directly using a class inheriting from {@link Component}:
   *
   * ```js
   * import { Component, Type } from '@wonderlandengine/api';
   *
   * export class MyComponent extends Component {
   *     static TypeName = 'my-component';
   *     static Properties = {
   *         myParam: {type: Type.Float, default: 42.0},
   *     };
   *     init() {}
   *     start() {}
   *     update(dt) {}
   *     onActivate() {}
   *     onDeactivate() {}
   *     onDestroy() {}
   * });
   *
   * // Here, we assume we have an engine already instantiated.
   * // In general, the registration occurs in the `index.js` file in your
   * // final application.
   * engine.registerComponent(MyComponent);
   * ```
   *
   * {@label CLASSES}
   * @param classes Custom component(s) extending {@link Component}.
   *
   * @since 1.0.0
   */
  registerComponent(...classes) {
    for (const arg of classes) {
      this.wasm._registerComponent(arg);
    }
  }
  /**
   * Update the loading screen progress bar.
   *
   * @param value Current loading percentage, in the range [0; 1].
   *
   * @since 1.2.1
   */
  setLoadingProgress(percentage) {
    this.wasm._wl_set_loading_screen_progress(clamp(percentage, 0, 1));
  }
  /**
   * Switch the current active scene.
   *
   * Once active, the scene will be updated and rendered on the canvas.
   *
   * The currently active scene is accessed via {@link WonderlandEngine.scene}:
   *
   * ```js
   * import {Component} from '@wonderlandengine/api';
   *
   * class MyComponent extends Component{
   *     start() {
   *         console.log(this.scene === this.engine.scene); // Prints `true`
   *     }
   * }
   * ```
   *
   * @note This method will throw if the scene isn't activatable.
   *
   * #### Component Lifecycle
   *
   * Marking a scene as active will:
   * * Call {@link Component#onDeactivate} for all active components of the previous scene
   * * Call {@link Component#onActivate} for all active components of the new scene
   *
   * #### Usage
   *
   * ```js
   * const scene = await engine.loadScene('Scene.bin');
   * engine.switchTo(scene);
   * ```
   *
   * @returns A promise that resolves once the scene is ready.
   *
   * @since 1.2.0
   */
  async switchTo(scene, opts = {}) {
    this.wasm._wl_deactivate_activeScene();
    const previous = this.scene;
    this._scene = scene;
    this.wasm._wl_scene_activate(scene._index);
    if (!this.onLoadingScreenEnd.isDataRetained) {
      this.onLoadingScreenEnd.notify();
    }
    scene._downloadDependencies();
    if (this.physics)
      this.physics._hit._scene = scene;
    await this.i18n.setLanguage(this.i18n.languageCode(0));
    const { dispatchReadyEvent = false } = opts;
    this.onSceneActivated.notify(previous, scene);
    if (dispatchReadyEvent)
      scene.dispatchReadyEvent();
  }
  /**
   * Load the scene from a URL, as the main scene of a new {@link Scene}.
   *
   * #### Usage
   *
   * ```js
   * // The method returns the main scene
   * const scene = await engine.loadMainScene();
   * ```
   *
   * #### Destruction
   *
   * Loading a new main scene entirely resets the state of the engine, and destroys:
   * - All loaded scenes, prefabs, and gltf files
   * - Meshes
   * - Textures
   * - Materials
   *
   * @note This method can only load Wonderland Engine `.bin` files.
   *
   * @param url The URL pointing to the scene to load.
   * @param progress Optional progress callback. When setting a custom
   *     callback, you need to manually call {@link setLoadingProgress} to
   *     get progress updates in the loading screen.
   * @returns The main scene of the new {@link Scene}.
   */
  async loadMainScene(opts, progress) {
    progress ??= (bytes, size) => {
      this.log.info(LogTag.Scene, `Scene downloading: ${bytes} / ${size}`);
      this.setLoadingProgress(bytes / size);
    };
    const options = await Scene.loadBuffer(opts, progress);
    return this.loadMainSceneFromBuffer(options);
  }
  /**
   * Similar to {@link WonderlandEngine.loadMainScene}, but loading is done from an ArrayBuffer.
   *
   * @param options An object containing the buffer and extra metadata.
   * @returns The main scene of the new {@link Scene}.
   */
  async loadMainSceneFromBuffer(options) {
    const { buffer, url } = Prefab.validateBufferOptions(options);
    const wasm = this.#wasm;
    wasm._wl_deactivate_activeScene();
    for (let i = this._scenes.length - 1; i >= 0; --i) {
      const scene = this._scenes[i];
      if (scene)
        scene.destroy();
    }
    this._textures._clear();
    this._materials._clear();
    this._meshes._clear();
    this._morphTargets._clear();
    let index = -1;
    const loadChunked = this.runtimeVersion.minor > 2 || this.runtimeVersion.patch >= 1;
    if (loadChunked) {
      const sink = new ChunkedSceneLoadSink(this, SceneType.Main, url);
      sink.write(new Uint8Array(buffer));
      sink.close();
      index = sink.sceneIndex;
    } else {
      const ptr = wasm.copyBufferToHeap(buffer);
      try {
        index = wasm._wl_load_main_scene(ptr, buffer.byteLength, wasm.tempUTF8(url));
      } finally {
        wasm._free(ptr);
      }
      if (index === -1)
        throw new Error("Failed to load main scene");
    }
    const mainScene = this._reload(index);
    let previous = this.scene;
    this._scene = mainScene;
    mainScene._initialize();
    this._scene = previous;
    await this.switchTo(mainScene, options);
    return mainScene;
  }
  /**
   * Load a {@link Prefab} from a URL.
   *
   * #### Usage
   *
   * ```js
   * const prefab = await engine.loadPrefab('Prefab.bin');
   * ```
   *
   * @note This method can only load Wonderland Engine `.bin` files.
   * @note This method is a wrapper around {@link WonderlandEngine.loadPrefabFromBuffer}.
   *
   * @param url The URL pointing to the prefab to load.
   * @param progress Optional progress callback.
   * @returns The loaded {@link Prefab}.
   */
  async loadPrefab(opts, progress = () => {
  }) {
    const options = await Scene.loadBuffer(opts, progress);
    return this.loadPrefabFromBuffer(options);
  }
  /**
   * Similar to {@link WonderlandEngine.loadPrefab}, but loading is done from an ArrayBuffer.
   *
   * @param options An object containing the buffer and extra metadata.
   * @returns A new loaded {@link Prefab}.
   */
  loadPrefabFromBuffer(options) {
    const scene = this._loadSceneFromBuffer(Prefab, options);
    if (this.wasm._wl_scene_activatable(scene._index)) {
      this.wasm._wl_scene_destroy(scene._index);
      throw new Error("File is not a prefab. To load a scene, use loadScene() instead");
    }
    scene._initialize();
    return scene;
  }
  /**
   * Load a scene from a URL.
   *
   * At the opposite of {@link WonderlandEngine.loadMainScene}, the scene loaded
   * will be added to the list of existing scenes, and its resources will be made
   * available for other scenes/prefabs/gltf to use.
   *
   * #### Resources Sharing
   *
   * Upon loading, the scene resources are added in the engine, and references
   * to those resources are updated.
   *
   * It's impossible for a scene loaded with this method to import pipelines.
   * Thus, the loaded scene will reference existing pipelines in the main scene,
   * based on their names.
   *
   * #### Usage
   *
   * ```js
   * const scene = await engine.loadScene('Scene.bin');
   * ```
   *
   * @note This method can only load Wonderland Engine `.bin` files.
   * @note This method is a wrapper around {@link WonderlandEngine#loadSceneFromBuffer}.
   *
   * @param url The URL pointing to the scene to load.
   * @param progress Optional progress callback.
   * @returns A new loaded {@link Scene}.
   */
  async loadScene(opts, progress = () => {
  }) {
    const options = await Scene.loadBuffer(opts, progress);
    return this.loadSceneFromBuffer(options);
  }
  /**
   * Create a glTF scene from a URL.
   *
   * @note This method is a wrapper around {@link WonderlandEngine.loadGLTFFromBuffer}.
   *
   * @param options The URL as a string, or an object of the form {@link GLTFOptions}.
   * @param progress Optional progress callback.
   * @returns A new loaded {@link PrefabGLTF}.
   */
  async loadGLTF(opts, progress = () => {
  }) {
    const memOptions = await Scene.loadBuffer(opts, progress);
    const options = isString(opts) ? memOptions : { ...opts, ...memOptions };
    return this.loadGLTFFromBuffer(options);
  }
  /**
   * Similar to {@link WonderlandEngine.loadScene}, but loading is done from an ArrayBuffer.
   *
   * @throws If the scene is streamable.
   *
   * @param options An object containing the buffer and extra metadata.
   * @returns A new loaded {@link Scene}.
   */
  loadSceneFromBuffer(options) {
    const scene = this._loadSceneFromBuffer(Scene, options);
    if (!this.wasm._wl_scene_activatable(scene._index)) {
      this.wasm._wl_scene_destroy(scene._index);
      throw new Error("File is not a scene. To load a prefab, use loadPrefab() instead");
    }
    scene._initialize();
    return scene;
  }
  /**
   * Similar to {@link WonderlandEngine.loadGLTF}, but loading is done from an ArrayBuffer.
   *
   * @param options An object containing the buffer and extra glTF metadata.
   * @returns A new loaded {@link PrefabGLTF}.
   */
  loadGLTFFromBuffer(options) {
    Scene.validateBufferOptions(options);
    const { buffer, extensions = false } = options;
    const wasm = this.wasm;
    const ptr = wasm.copyBufferToHeap(buffer);
    try {
      const index = wasm._wl_glTF_scene_create(extensions, ptr, buffer.byteLength);
      const scene = new PrefabGLTF(this, index);
      this._scenes[scene._index] = scene;
      return scene;
    } finally {
      wasm._free(ptr);
    }
  }
  /**
   * Checks whether the given component is registered or not.
   *
   * @param typeOrClass A string representing the component typename (e.g., `'cursor-component'`),
   *     or a component class (e.g., `CursorComponent`).
   * @returns `true` if the component is registered, `false` otherwise.
   */
  isRegistered(typeOrClass) {
    return this.#wasm.isRegistered(isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName);
  }
  /**
   * Resize the canvas and the rendering context.
   *
   * @note The `width` and `height` parameters will be scaled by the
   * `devicePixelRatio` value. By default, the pixel ratio used is
   * [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio).
   *
   * @param width The width, in CSS pixels.
   * @param height The height, in CSS pixels.
   * @param devicePixelRatio The pixel ratio factor.
   */
  resize(width, height, devicePixelRatio = window.devicePixelRatio) {
    width = width * devicePixelRatio;
    height = height * devicePixelRatio;
    this.canvas.width = width;
    this.canvas.height = height;
    this.wasm._wl_application_resize(width, height);
    this.onResize.notify();
  }
  /**
   * Run the next frame.
   *
   * @param fixedDelta The elapsed time between this frame and the previous one.
   *
   * @note The engine automatically schedules next frames. You should only
   * use this method for testing.
   */
  nextFrame(fixedDelta = 0) {
    this.#wasm._wl_nextFrame(fixedDelta);
  }
  /**
   * Request an XR session.
   *
   * @note Please use this call instead of directly calling `navigator.xr.requestSession()`.
   * Wonderland Engine requires to be aware that a session is started, and this
   * is done through this call.
   *
   * @param mode The XR mode.
   * @param features An array of required features, e.g., `['local-floor', 'hit-test']`.
   * @param optionalFeatures An array of optional features, e.g., `['bounded-floor', 'depth-sensing']`.
   * @returns A promise resolving with the `XRSession`, a string error message otherwise.
   */
  requestXRSession(mode, features, optionalFeatures = []) {
    return checkXRSupport().then(() => this.#wasm.webxr_requestSession(mode, features, optionalFeatures));
  }
  /**
   * Offer an XR session.
   *
   * Adds an interactive UI element to the browser interface to start an XR
   * session. Browser support is optional, so it's advised to still allow
   * requesting a session with a UI element on the website itself.
   *
   * @note Please use this call instead of directly calling `navigator.xr.offerSession()`.
   * Wonderland Engine requires to be aware that a session is started, and this
   * is done through this call.
   *
   * @param mode The XR mode.
   * @param features An array of required features, e.g., `['local-floor', 'hit-test']`.
   * @param optionalFeatures An array of optional features, e.g., `['bounded-floor', 'depth-sensing']`.
   * @returns A promise resolving with the `XRSession`, a string error message otherwise.
   *
   * @since 1.1.5
   */
  offerXRSession(mode, features, optionalFeatures = []) {
    return checkXRSupport().then(() => this.#wasm.webxr_offerSession(mode, features, optionalFeatures));
  }
  /**
   * Wrap an object ID using {@link Object}.
   *
   * @note This method performs caching and will return the same
   * instance on subsequent calls.
   *
   * @param objectId ID of the object to create.
   *
   * @deprecated Use {@link Scene#wrap} instead.
   *
   * @returns The object
   */
  wrapObject(objectId) {
    return this.scene.wrap(objectId);
  }
  toString() {
    return "engine";
  }
  /* Public Getters & Setter */
  /** Currently active scene. */
  get scene() {
    return this._scene;
  }
  /**
   * WebAssembly bridge.
   *
   * @note Use with care. This object is used to communicate
   * with the WebAssembly code throughout the api.
   *
   * @hidden
   */
  get wasm() {
    return this.#wasm;
  }
  /** Canvas element that Wonderland Engine renders to. */
  get canvas() {
    return this.#wasm.canvas;
  }
  /**
   * Current WebXR session or `null` if no session active.
   *
   * @deprecated Use {@link XR.session} on the {@link xr}
   * object instead.
   */
  get xrSession() {
    return this.xr?.session ?? null;
  }
  /**
   * Current WebXR frame or `null` if no session active.
   *
   * @deprecated Use {@link XR.frame} on the {@link xr}
   * object instead.
   */
  get xrFrame() {
    return this.xr?.frame ?? null;
  }
  /**
   * Current WebXR base layer or `null` if no session active.
   *
   * @deprecated Use {@link XR.baseLayer} on the {@link xr}
   * object instead.
   */
  get xrBaseLayer() {
    return this.xr?.baseLayer ?? null;
  }
  /**
   * Current WebXR framebuffer or `null` if no session active.
   *
   * @deprecated Use {@link XR.framebuffers} on the
   * {@link xr} object instead.
   */
  get xrFramebuffer() {
    return this.xr?.framebuffers[0] ?? null;
  }
  /** Framebuffer scale factor. */
  get xrFramebufferScaleFactor() {
    return this.#wasm.webxr_framebufferScaleFactor;
  }
  set xrFramebufferScaleFactor(value) {
    this.#wasm.webxr_framebufferScaleFactor = value;
  }
  /** Physics manager, only available when physx is enabled in the runtime. */
  get physics() {
    return this.#physics;
  }
  /** Texture resources */
  get textures() {
    return this._textures;
  }
  /** Material resources */
  get materials() {
    return this._materials;
  }
  /** Mesh resources */
  get meshes() {
    return this._meshes;
  }
  /** Morph target set resources */
  get morphTargets() {
    return this._morphTargets;
  }
  /** Font resources */
  get fonts() {
    return this._fonts;
  }
  /** Get all uncompressed images. */
  get images() {
    const wasm = this.wasm;
    const max2 = wasm._tempMemSize >> 1;
    const count = wasm._wl_get_images(wasm._tempMem, max2);
    const result = new Array(count);
    for (let i = 0; i < count; ++i) {
      const index = wasm._tempMemUint16[i];
      result[i] = wasm._images[index];
    }
    return result;
  }
  /**
   * Promise that resolve once all uncompressed images are loaded.
   *
   * This is equivalent to calling {@link WonderlandEngine.images}, and wrapping each
   * `load` listener into a promise.
   */
  get imagesPromise() {
    const promises = this.images.map((i) => onImageReady(i));
    return Promise.all(promises);
  }
  /*
   * Enable or disable the mechanism to automatically resize the canvas.
   *
   * Internally, the engine uses a [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
   * Changing the canvas css will thus automatically be tracked by the engine.
   */
  set autoResizeCanvas(flag) {
    const state = !!this.#resizeObserver;
    if (state === flag)
      return;
    if (!flag) {
      this.#resizeObserver?.unobserve(this.canvas);
      this.#resizeObserver = null;
      return;
    }
    this.#resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.canvas) {
          this.resize(entry.contentRect.width, entry.contentRect.height);
        }
      }
    });
    this.#resizeObserver.observe(this.canvas);
  }
  /** `true` if the canvas is automatically resized by the engine. */
  get autoResizeCanvas() {
    return this.#resizeObserver !== null;
  }
  /** Retrieves the runtime version. */
  get runtimeVersion() {
    const wasm = this.#wasm;
    wasm._wl_application_version(wasm._tempMem);
    return {
      major: wasm._tempMemUint16[0],
      minor: wasm._tempMemUint16[1],
      patch: wasm._tempMemUint16[2],
      rc: wasm._tempMemUint16[3]
    };
  }
  /** Engine {@link Logger}. Use it to turn on / off logging. */
  get log() {
    return this.#wasm._log;
  }
  /* Internal-Only Methods */
  /**
   * Initialize the engine.
   *
   * @note Should be called after the WebAssembly is fully loaded.
   *
   * @hidden
   */
  _init() {
    const onXRStart = () => {
      this.#initialReferenceSpaceType = this.xr.currentReferenceSpaceType;
      const newSpace = this.xr.referenceSpaceForType("local") ?? this.xr.referenceSpaceForType("viewer");
      this.xr.currentReferenceSpace = newSpace;
    };
    this.onXRSessionStart.add(onXRStart);
    this.onLoadingScreenEnd.once(() => {
      this.onXRSessionStart.remove(onXRStart);
      if (!this.xr || !this.#initialReferenceSpaceType)
        return;
      this.xr.currentReferenceSpace = this.xr.referenceSpaceForType(this.#initialReferenceSpaceType) ?? this.xr.referenceSpaceForType("viewer");
      this.#initialReferenceSpaceType = null;
    });
    this.#wasm._wl_set_error_callback(this.#wasm.addFunction((messagePtr) => {
      throw new Error(this.#wasm.UTF8ToString(messagePtr));
    }, "vi"));
    this.#physics = null;
    if (this.#wasm.withPhysX) {
      const physics = new Physics(this);
      this.#wasm._wl_physx_set_collision_callback(this.#wasm.addFunction((a, index, type, b) => {
        const physxA = this.scene._components.wrapPhysx(a);
        const physxB = this.scene._components.wrapPhysx(b);
        const callback = physics._callbacks[physxA._id][index];
        callback(type, physxB);
      }, "viiii"));
      this.#physics = physics;
    }
    this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
    this._scene = this._reload(0);
  }
  /**
   * Reset the runtime state, including:
   *     - Component cache
   *     - Images
   *     - Callbacks
   *
   * @note This api is meant to be used internally.
   *
   * @hidden
   */
  _reset() {
    this.wasm.reset();
    this._scenes.length = 0;
    this._scene = this._reload(0);
    this.switchTo(this._scene);
  }
  /**
   * Add an empty scene.
   *
   * @returns The newly created scene
   *
   * @hidden
   */
  _createEmpty() {
    const wasm = this.wasm;
    const index = wasm._wl_scene_create_empty();
    const scene = new Scene(this, index);
    this._scenes[index] = scene;
    return scene;
  }
  /** @hidden */
  _destroyScene(instance) {
    const wasm = this.wasm;
    wasm._wl_scene_destroy(instance._index);
    const index = instance._index;
    instance._index = -1;
    if (this.erasePrototypeOnDestroy) {
      Object.setPrototypeOf(instance, DestroyedPrefabInstance);
    }
    this._scenes[index] = null;
  }
  /**
   * Reload the state of the engine with a new main scene.
   *
   * @param index Scene index.
   *
   * @hidden
   */
  _reload(index) {
    const scene = new Scene(this, index);
    this._scenes[index] = scene;
    this._textures = new TextureManager(this);
    this._materials = new MaterialManager(this);
    this._meshes = new MeshManager(this);
    this._morphTargets = new ResourceManager(this, MorphTargets);
    this._fonts = new ResourceManager(this, Font);
    return scene;
  }
  /**
   * Helper to load prefab and activatable scene.
   *
   * @param options Loading options.
   * @returns The the loaded prefab.
   *
   * @hidden
   */
  _loadSceneFromBuffer(PrefabClass, options) {
    const { buffer, url } = Scene.validateBufferOptions(options);
    const wasm = this.wasm;
    let index = -1;
    const loadChunked = this.runtimeVersion.minor > 2 || this.runtimeVersion.patch >= 1;
    if (loadChunked) {
      const sink = new ChunkedSceneLoadSink(this, SceneType.Prefab, url);
      sink.write(new Uint8Array(buffer));
      sink.close();
      index = sink.sceneIndex;
    } else {
      const ptr = wasm.copyBufferToHeap(buffer);
      try {
        index = wasm._wl_scene_create(ptr, buffer.byteLength, wasm.tempUTF8(url));
      } finally {
        wasm._free(ptr);
      }
      if (!index)
        throw new Error("Failed to parse scene");
    }
    const scene = new PrefabClass(this, index);
    this._scenes[index] = scene;
    return scene;
  }
};

// node_modules/@wonderlandengine/api/dist/utils/bitset.js
function assert(bit) {
  if (bit >= 32) {
    throw new Error(`BitSet.enable(): Value ${bit} is over 31`);
  }
}
var BitSet = class {
  /** Enabled bits. @hidden */
  _bits = 0;
  /**
   * Enable the bit at the given index.
   *
   * @param bits A spread of all the bits to enable.
   * @returns Reference to self (for method chaining).
   */
  enable(...bits) {
    for (const bit of bits) {
      assert(bit);
      this._bits |= 1 << bit >>> 0;
    }
    return this;
  }
  /**
   * Enable all bits.
   *
   * @returns Reference to self (for method chaining).
   */
  enableAll() {
    this._bits = ~0;
    return this;
  }
  /**
   * Disable the bit at the given index.
   *
   * @param bits A spread of all the bits to disable.
   * @returns Reference to self (for method chaining).
   */
  disable(...bits) {
    for (const bit of bits) {
      assert(bit);
      this._bits &= ~(1 << bit >>> 0);
    }
    return this;
  }
  /**
   * Disable all bits.
   *
   * @returns Reference to self (for method chaining).
   */
  disableAll() {
    this._bits = 0;
    return this;
  }
  /**
   * Checker whether the bit is set or not.
   *
   * @param bit The bit to check.
   * @returns `true` if it's enabled, `false` otherwise.
   */
  enabled(bit) {
    return !!(this._bits & 1 << bit >>> 0);
  }
};

// node_modules/@wonderlandengine/api/dist/utils/logger.js
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["Info"] = 0] = "Info";
  LogLevel2[LogLevel2["Warn"] = 1] = "Warn";
  LogLevel2[LogLevel2["Error"] = 2] = "Error";
})(LogLevel || (LogLevel = {}));
var Logger = class {
  /**
   * Bitset of enabled levels.
   *
   * @hidden
   */
  levels = new BitSet();
  /**
   * Bitset of enabled tags.
   *
   * @hidden
   */
  tags = new BitSet().enableAll();
  /**
   * Create a new logger instance.
   *
   * @param levels Default set of levels to enable.
   */
  constructor(...levels) {
    this.levels.enable(...levels);
  }
  /**
   * Log the message(s) using `console.log`.
   *
   * @param tag Tag represented by a positive integer.
   * @param msg A spread of message to log.
   * @returns Reference to self (for method chaining).
   */
  info(tag, ...msg) {
    if (this.levels.enabled(LogLevel.Info) && this.tags.enabled(tag)) {
      console.log(...msg);
    }
    return this;
  }
  /**
   * Log the message(s) using `console.warn`.
   *
   * @param tag Tag represented by a positive integer.
   * @param msg A spread of message to log.
   * @returns Reference to self (for method chaining).
   */
  warn(tag, ...msg) {
    if (this.levels.enabled(LogLevel.Warn) && this.tags.enabled(tag)) {
      console.warn(...msg);
    }
    return this;
  }
  /**
   * Log the message(s) using `console.error`.
   *
   * @param tag Tag represented by a positive integer.
   * @param msg A spread of message to log.
   * @returns Reference to self (for method chaining).
   */
  error(tag, ...msg) {
    if (this.levels.enabled(LogLevel.Error) && this.tags.enabled(tag)) {
      console.error(...msg);
    }
    return this;
  }
};

// node_modules/@wonderlandengine/api/dist/utils/cbor.js
var kCborTagBignum = 2;
var kCborTagNegativeBignum = 3;
var kCborTagUint8 = 64;
var kCborTagUint16 = 69;
var kCborTagUint32 = 70;
var kCborTagUint64 = 71;
var kCborTagInt8 = 72;
var kCborTagInt16 = 77;
var kCborTagInt32 = 78;
var kCborTagInt64 = 79;
var kCborTagFloat32 = 85;
var kCborTagFloat64 = 86;
function decode(data, tagger = (_, value) => value, options = {}) {
  const { dictionary = "object" } = options;
  const dataView = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let offset2 = 0;
  function commitRead(length5, value) {
    offset2 += length5;
    return value;
  }
  function readArrayBuffer(length5) {
    return commitRead(length5, data.subarray(offset2, offset2 + length5));
  }
  function readFloat16() {
    const POW_2_24 = 5960464477539063e-23;
    const tempArrayBuffer = new ArrayBuffer(4);
    const tempDataView = new DataView(tempArrayBuffer);
    const value = readUint16();
    const sign = value & 32768;
    let exponent = value & 31744;
    const fraction = value & 1023;
    if (exponent === 31744)
      exponent = 255 << 10;
    else if (exponent !== 0)
      exponent += 127 - 15 << 10;
    else if (fraction !== 0)
      return (sign ? -1 : 1) * fraction * POW_2_24;
    tempDataView.setUint32(0, sign << 16 | exponent << 13 | fraction << 13);
    return tempDataView.getFloat32(0);
  }
  function readFloat32() {
    return commitRead(4, dataView.getFloat32(offset2));
  }
  function readFloat64() {
    return commitRead(8, dataView.getFloat64(offset2));
  }
  function readUint8() {
    return commitRead(1, data[offset2]);
  }
  function readUint16() {
    return commitRead(2, dataView.getUint16(offset2));
  }
  function readUint32() {
    return commitRead(4, dataView.getUint32(offset2));
  }
  function readUint64() {
    return commitRead(8, dataView.getBigUint64(offset2));
  }
  function readBreak() {
    if (data[offset2] !== 255)
      return false;
    offset2 += 1;
    return true;
  }
  function readLength(additionalInformation) {
    if (additionalInformation < 24)
      return additionalInformation;
    if (additionalInformation === 24)
      return readUint8();
    if (additionalInformation === 25)
      return readUint16();
    if (additionalInformation === 26)
      return readUint32();
    if (additionalInformation === 27) {
      const integer = readUint64();
      if (integer <= Number.MAX_SAFE_INTEGER)
        return Number(integer);
      return integer;
    }
    if (additionalInformation === 31)
      return -1;
    throw new Error("CBORError: Invalid length encoding");
  }
  function readIndefiniteStringLength(majorType) {
    const initialByte = readUint8();
    if (initialByte === 255)
      return -1;
    const length5 = readLength(initialByte & 31);
    if (length5 < 0 || initialByte >> 5 !== majorType) {
      throw new Error("CBORError: Invalid indefinite length element");
    }
    return Number(length5);
  }
  function appendUtf16Data(utf16data, length5) {
    for (let i = 0; i < length5; ++i) {
      let value = readUint8();
      if (value & 128) {
        if (value < 224) {
          value = (value & 31) << 6 | readUint8() & 63;
          length5 -= 1;
        } else if (value < 240) {
          value = (value & 15) << 12 | (readUint8() & 63) << 6 | readUint8() & 63;
          length5 -= 2;
        } else {
          value = (value & 7) << 18 | (readUint8() & 63) << 12 | (readUint8() & 63) << 6 | readUint8() & 63;
          length5 -= 3;
        }
      }
      if (value < 65536) {
        utf16data.push(value);
      } else {
        value -= 65536;
        utf16data.push(55296 | value >> 10);
        utf16data.push(56320 | value & 1023);
      }
    }
  }
  function decodeItem() {
    const initialByte = readUint8();
    const majorType = initialByte >> 5;
    const additionalInformation = initialByte & 31;
    let i;
    let length5;
    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }
    length5 = readLength(additionalInformation);
    if (length5 < 0 && (majorType < 2 || 6 < majorType)) {
      throw new Error("CBORError: Invalid length");
    }
    switch (majorType) {
      case 0:
        return length5;
      case 1:
        if (typeof length5 === "number") {
          return -1 - length5;
        }
        return -1n - length5;
      case 2: {
        if (length5 < 0) {
          const elements = [];
          let fullArrayLength = 0;
          while ((length5 = readIndefiniteStringLength(majorType)) >= 0) {
            fullArrayLength += length5;
            elements.push(readArrayBuffer(length5));
          }
          const fullArray = new Uint8Array(fullArrayLength);
          let fullArrayOffset = 0;
          for (i = 0; i < elements.length; ++i) {
            fullArray.set(elements[i], fullArrayOffset);
            fullArrayOffset += elements[i].length;
          }
          return fullArray;
        }
        return readArrayBuffer(length5).slice();
      }
      case 3: {
        const utf16data = [];
        if (length5 < 0) {
          while ((length5 = readIndefiniteStringLength(majorType)) >= 0) {
            appendUtf16Data(utf16data, length5);
          }
        } else {
          appendUtf16Data(utf16data, length5);
        }
        let string = "";
        const DECODE_CHUNK_SIZE = 8192;
        for (i = 0; i < utf16data.length; i += DECODE_CHUNK_SIZE) {
          string += String.fromCharCode.apply(null, utf16data.slice(i, i + DECODE_CHUNK_SIZE));
        }
        return string;
      }
      case 4: {
        let retArray;
        if (length5 < 0) {
          retArray = [];
          let index = 0;
          while (!readBreak()) {
            retArray.push(decodeItem());
          }
        } else {
          retArray = new Array(length5);
          for (i = 0; i < length5; ++i) {
            retArray[i] = decodeItem();
          }
        }
        return retArray;
      }
      case 5: {
        if (dictionary === "map") {
          const retMap = /* @__PURE__ */ new Map();
          for (i = 0; i < length5 || length5 < 0 && !readBreak(); ++i) {
            const key = decodeItem();
            if (retMap.has(key)) {
              throw new Error("CBORError: Duplicate key encountered");
            }
            retMap.set(key, decodeItem());
          }
          return retMap;
        }
        const retObject = {};
        for (i = 0; i < length5 || length5 < 0 && !readBreak(); ++i) {
          const key = decodeItem();
          if (Object.prototype.hasOwnProperty.call(retObject, key)) {
            throw new Error("CBORError: Duplicate key encountered");
          }
          retObject[key] = decodeItem();
        }
        return retObject;
      }
      case 6: {
        const value = decodeItem();
        const tag = length5;
        if (value instanceof Uint8Array) {
          switch (tag) {
            case kCborTagBignum:
            case kCborTagNegativeBignum:
              let num = value.reduce((acc, n) => (acc << 8n) + BigInt(n), 0n);
              if (tag == kCborTagNegativeBignum) {
                num = -1n - num;
              }
              return num;
            case kCborTagUint8:
              return value;
            case kCborTagInt8:
              return new Int8Array(value.buffer);
            case kCborTagUint16:
              return new Uint16Array(value.buffer);
            case kCborTagInt16:
              return new Int16Array(value.buffer);
            case kCborTagUint32:
              return new Uint32Array(value.buffer);
            case kCborTagInt32:
              return new Int32Array(value.buffer);
            case kCborTagUint64:
              return new BigUint64Array(value.buffer);
            case kCborTagInt64:
              return new BigInt64Array(value.buffer);
            case kCborTagFloat32:
              return new Float32Array(value.buffer);
            case kCborTagFloat64:
              return new Float64Array(value.buffer);
          }
        }
        return tagger(tag, value);
      }
      case 7:
        switch (length5) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return void 0;
          default:
            return length5;
        }
    }
  }
  const ret = decodeItem();
  if (offset2 !== data.byteLength) {
    throw new Error("CBORError: Remaining bytes");
  }
  return ret;
}
var CBOR = {
  decode
};

// node_modules/@wonderlandengine/api/dist/wasm.js
var _componentDefaults = /* @__PURE__ */ new Map([
  [Type.Bool, false],
  [Type.Int, 0],
  [Type.Float, 0],
  [Type.String, ""],
  [Type.Enum, void 0],
  [Type.Object, null],
  [Type.Mesh, null],
  [Type.Texture, null],
  [Type.Material, null],
  [Type.Animation, null],
  [Type.Skin, null],
  [Type.Color, Float32Array.from([0, 0, 0, 1])],
  [Type.Vector2, Float32Array.from([0, 0])],
  [Type.Vector3, Float32Array.from([0, 0, 0])],
  [Type.Vector4, Float32Array.from([0, 0, 0, 0])]
]);
function _setupDefaults(ctor) {
  for (const name in ctor.Properties) {
    const p = ctor.Properties[name];
    if (p.type === Type.Enum) {
      if (p.values?.length) {
        if (typeof p.default !== "number") {
          p.default = p.values.indexOf(p.default);
        }
        if (p.default < 0 || p.default >= p.values.length) {
          p.default = 0;
        }
      } else {
        p.default = void 0;
      }
    } else if ((p.type === Type.Color || p.type === Type.Vector2 || p.type === Type.Vector3 || p.type === Type.Vector4) && Array.isArray(p.default)) {
      p.default = Float32Array.from(p.default);
    } else if (p.default === void 0) {
      const cloner = p.cloner ?? defaultPropertyCloner;
      p.default = cloner.clone(p.type, _componentDefaults.get(p.type));
    }
    ctor.prototype[name] = p.default;
  }
}
function _setPropertyOrder(ctor) {
  ctor._propertyOrder = ctor.hasOwnProperty("Properties") ? Object.keys(ctor.Properties).sort() : [];
}
var WASM = class {
  /**
   * Emscripten worker field.
   *
   * @note This api is meant to be used internally.
   */
  worker = "";
  /**
   * Emscripten wasm field.
   *
   * @note This api is meant to be used internally.
   */
  wasm = null;
  /**
   * Emscripten canvas.
   *
   * @note This api is meant to be used internally.
   */
  canvas = null;
  /**
   * WebGPU device.
   *
   * @note This api is meant to be used internally.
   */
  preinitializedWebGPUDevice = null;
  /** Current WebXR  */
  /**
   * Emscripten WebXR session.
   *
   * @note This api is meant to be used internally.
   */
  webxr_session = null;
  /**
   * Emscripten WebXR request session callback.
   *
   * @note This api is meant to be used internally.
   */
  webxr_requestSession = null;
  /**
   * Emscripten WebXR offer session callback.
   *
   * @note This api is meant to be used internally.
   */
  webxr_offerSession = null;
  /**
   * Emscripten WebXR frame.
   *
   * @note This api is meant to be used internally.
   */
  webxr_frame = null;
  /**
   * Emscripten current WebXR reference space.
   *
   * @note This api is meant to be used internally.
   */
  webxr_refSpace = null;
  /**
   * Emscripten WebXR reference spaces.
   *
   * @note This api is meant to be used internally.
   */
  webxr_refSpaces = null;
  /**
   * Emscripten WebXR current reference space type.
   *
   * @note This api is meant to be used internally.
   */
  webxr_refSpaceType = null;
  /**
   * Emscripten WebXR GL projection layer.
   *
   * @note This api is meant to be used internally.
   */
  webxr_baseLayer = null;
  /**
   * Emscripten WebXR framebuffer scale factor.
   *
   * @note This api is meant to be used internally.
   */
  webxr_framebufferScaleFactor = 1;
  /**
   * Emscripten WebXR framebuffer(s).
   *
   * @note This api is meant to be used internally.
   */
  /* webxr_fbo will not get overwritten if we are rendering to the
   * default framebuffer, e.g., when using WebXR emulator. */
  webxr_fbo = 0;
  /**
   * Convert a WASM memory view to a JavaScript string.
   *
   * @param ptr Pointer start
   * @param ptrEnd Pointer end
   * @returns JavaScript string
   */
  UTF8ViewToString;
  /** Logger instance. */
  _log = new Logger();
  /** If `true`, logs will not spam the console on error. */
  _deactivate_component_on_error = false;
  /** Temporary memory pointer. */
  _tempMem = null;
  /** Temporary memory size. */
  _tempMemSize = 0;
  /** Temporary float memory view. */
  _tempMemFloat = null;
  /** Temporary int memory view. */
  _tempMemInt = null;
  /** Temporary uint8 memory view. */
  _tempMemUint8 = null;
  /** Temporary uint32 memory view. */
  _tempMemUint32 = null;
  /** Temporary uint16 memory view. */
  _tempMemUint16 = null;
  /** Loading screen .bin file data */
  _loadingScreen = null;
  /** List of callbacks triggered when the scene is loaded. */
  _sceneLoadedCallback = [];
  /** Image cache. */
  _images = [null];
  /** Component instances. */
  _components = null;
  /** Component Type info. */
  _componentTypes = [];
  /** Index per component type name. */
  _componentTypeIndices = {};
  /** Wonderland engine instance. */
  _engine = null;
  /**
   * `true` if this runtime is using physx.
   *
   * @note This api is meant to be used internally.
   */
  _withPhysX = false;
  /** Decoder for UTF8 `ArrayBuffer` to JavaScript string. */
  _utf8Decoder = new TextDecoder("utf8");
  /**
   * Registration index of {@link BrokenComponent}.
   *
   * This is used to return dummy instances when a component
   * isn't registered.
   *
   * @hidden
   */
  _brokenComponentIndex = 0;
  /**
   * Create a new instance of the WebAssembly <> API bridge.
   *
   * @param threads `true` if the runtime used has threads support
   */
  constructor(threads2) {
    if (threads2) {
      this.UTF8ViewToString = (s, e) => {
        if (!s)
          return "";
        return this._utf8Decoder.decode(this.HEAPU8.slice(s, e));
      };
    } else {
      this.UTF8ViewToString = (s, e) => {
        if (!s)
          return "";
        return this._utf8Decoder.decode(this.HEAPU8.subarray(s, e));
      };
    }
    this._brokenComponentIndex = this._registerComponent(BrokenComponent);
  }
  /**
   * Reset the cache of the library.
   *
   * @note Should only be called when tearing down the runtime.
   */
  reset() {
    this._wl_reset();
    this._components = null;
    this._images.length = 1;
    this.allocateTempMemory(1024);
    this._componentTypes = [];
    this._componentTypeIndices = {};
    this._brokenComponentIndex = this._registerComponent(BrokenComponent);
  }
  /**
   * Checks whether the given component is registered or not.
   *
   * @param ctor  A string representing the component typename (e.g., `'cursor-component'`).
   * @returns `true` if the component is registered, `false` otherwise.
   */
  isRegistered(type) {
    return type in this._componentTypeIndices;
  }
  /**
   * Register a legacy component in this Emscripten instance.
   *
   * @note This api is meant to be used internally.
   *
   * @param typeName The name of the component.
   * @param params An object containing the parameters (properties).
   * @param object The object's prototype.
   * @returns The registration index
   */
  _registerComponentLegacy(typeName, params, object) {
    const ctor = class CustomComponent extends Component {
    };
    ctor.TypeName = typeName;
    ctor.Properties = params;
    Object.assign(ctor.prototype, object);
    return this._registerComponent(ctor);
  }
  /**
   * Register a class component in this Emscripten instance.
   *
   * @note This api is meant to be used internally.
   *
   * @param ctor The class to register.
   * @returns The registration index.
   */
  _registerComponent(ctor) {
    if (!ctor.TypeName)
      throw new Error("no name provided for component.");
    if (!ctor.prototype._triggerInit) {
      throw new Error(`registerComponent(): Component ${ctor.TypeName} must extend Component`);
    }
    inheritProperties(ctor);
    _setupDefaults(ctor);
    _setPropertyOrder(ctor);
    const typeIndex = ctor.TypeName in this._componentTypeIndices ? this._componentTypeIndices[ctor.TypeName] : this._componentTypes.length;
    this._componentTypes[typeIndex] = ctor;
    this._componentTypeIndices[ctor.TypeName] = typeIndex;
    if (ctor === BrokenComponent)
      return typeIndex;
    this._log.info(LogTag.Engine, "Registered component", ctor.TypeName, `(class ${ctor.name})`, "with index", typeIndex);
    if (ctor.onRegister)
      ctor.onRegister(this._engine);
    return typeIndex;
  }
  /**
   * Allocate the requested amount of temporary memory
   * in this WASM instance.
   *
   * @param size The number of bytes to allocate
   */
  allocateTempMemory(size) {
    this._log.info(LogTag.Engine, "Allocating temp mem:", size);
    this._tempMemSize = size;
    if (this._tempMem)
      this._free(this._tempMem);
    this._tempMem = this._malloc(this._tempMemSize);
    this.updateTempMemory();
  }
  /**
   * @todo: Delete this and only keep `allocateTempMemory`
   *
   * @param size Number of bytes to allocate
   */
  requireTempMem(size) {
    if (this._tempMemSize >= size)
      return;
    this.allocateTempMemory(Math.ceil(size / 1024) * 1024);
  }
  /**
   * Update the temporary memory views. This must be called whenever the
   * temporary memory address changes.
   *
   * @note This api is meant to be used internally.
   */
  updateTempMemory() {
    this._tempMemFloat = new Float32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
    this._tempMemInt = new Int32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
    this._tempMemUint32 = new Uint32Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 2);
    this._tempMemUint16 = new Uint16Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize >> 1);
    this._tempMemUint8 = new Uint8Array(this.HEAP8.buffer, this._tempMem, this._tempMemSize);
  }
  /**
   * Returns a uint8 buffer view on temporary WASM memory.
   *
   * **Note**: this method might allocate if the requested memory is bigger
   * than the current temporary memory allocated.
   *
   * @param count The number of **elements** required
   * @returns A {@link TypedArray} over the WASM memory
   */
  getTempBufferU8(count) {
    this.requireTempMem(count);
    return this._tempMemUint8;
  }
  /**
   * Returns a uint16 buffer view on temporary WASM memory.
   *
   * **Note**: this method might allocate if the requested memory is bigger
   * than the current temporary memory allocated.
   *
   * @param count The number of **elements** required
   * @returns A {@link TypedArray} over the WASM memory
   */
  getTempBufferU16(count) {
    this.requireTempMem(count * 2);
    return this._tempMemUint16;
  }
  /**
   * Returns a uint32 buffer view on temporary WASM memory.
   *
   * **Note**: this method might allocate if the requested memory is bigger
   * than the current temporary memory allocated.
   *
   * @param count The number of **elements** required.
   * @returns A {@link TypedArray} over the WASM memory.
   */
  getTempBufferU32(count) {
    this.requireTempMem(count * 4);
    return this._tempMemUint32;
  }
  /**
   * Returns a int32 buffer view on temporary WASM memory.
   *
   * **Note**: this method might allocate if the requested memory is bigger
   * than the current temporary memory allocated.
   *
   * @param count The number of **elements** required.
   * @returns A {@link TypedArray} over the WASM memory.
   */
  getTempBufferI32(count) {
    this.requireTempMem(count * 4);
    return this._tempMemInt;
  }
  /**
   * Returns a float32 buffer view on temporary WASM memory.
   *
   * **Note**: this method might allocate if the requested memory is bigger
   * than the current temporary memory allocated.
   *
   * @param count The number of **elements** required.
   * @returns A {@link TypedArray} over the WASM memory.
   */
  getTempBufferF32(count) {
    this.requireTempMem(count * 4);
    return this._tempMemFloat;
  }
  /**
   * Copy the string into temporary WASM memory and retrieve the pointer.
   *
   * @note This method will compute the strlen and append a `\0`.
   *
   * @note The result should be used **directly** otherwise it might get
   * overridden by any next call modifying the temporary memory.
   *
   * @param str The string to write to temporary memory
   * @param byteOffset The starting byte offset in the temporary memory at which
   *     the string should be written. This is useful when using multiple temporaries.
   * @return The temporary pointer onto the WASM memory
   */
  tempUTF8(str5, byteOffset = 0) {
    const strLen = this.lengthBytesUTF8(str5) + 1;
    this.requireTempMem(strLen + byteOffset);
    const ptr = this._tempMem + byteOffset;
    this.stringToUTF8(str5, ptr, strLen);
    return ptr;
  }
  /**
   * Copy the buffer into the WASM heap.
   *
   * @note The returned pointer must be freed.
   *
   * @param buffer The buffer to copy into the heap.
   * @returns An allocated pointer, that must be free after use.
   */
  copyBufferToHeap(buffer) {
    const size = buffer.byteLength;
    const ptr = this._malloc(size);
    this.HEAPU8.set(new Uint8Array(buffer), ptr);
    return ptr;
  }
  /**
   * Returns `true` if the runtime supports physx or not.
   */
  get withPhysX() {
    return this._withPhysX;
  }
  /**
   * Set the engine instance holding this bridge.
   *
   * @note This api is meant to be used internally.
   *
   * @param engine The engine instance.
   */
  _setEngine(engine2) {
    this._engine = engine2;
  }
  /* WebAssembly to JS call bridge. */
  _wljs_xr_session_start(mode) {
    if (this._engine.xr === null) {
      this._engine.xr = new XR(this, mode);
      this._engine.onXRSessionStart.notify(this.webxr_session, mode);
    }
  }
  _wljs_xr_session_end() {
    const startEmitter = this._engine.onXRSessionStart;
    if (startEmitter instanceof RetainEmitter)
      startEmitter.reset();
    this._engine.onXRSessionEnd.notify();
    this._engine.xr = null;
  }
  _wljs_xr_disable() {
    this._engine.arSupported = false;
    this._engine.vrSupported = false;
  }
  _wljs_init(withPhysX) {
    this._withPhysX = withPhysX;
    this.allocateTempMemory(1024);
  }
  _wljs_scene_switch(index) {
    const scene = this._engine._scenes[index];
    this._components = scene?._jsComponents ?? null;
  }
  _wljs_destroy_image(index) {
    const img = this._images[index];
    if (!img)
      return;
    this._images[index] = null;
    if (img.src !== void 0) {
      img.src = "";
    }
    if (img.onload !== void 0) {
      img.onload = null;
    }
    if (img.onerror !== void 0) {
      img.onerror = null;
    }
  }
  _wljs_objects_markDestroyed(sceneIndex, idsPtr, count) {
    const scene = this._engine._scenes[sceneIndex];
    const start = idsPtr >>> 1;
    for (let i = 0; i < count; ++i) {
      const id = this.HEAPU16[start + i];
      scene._destroyObject(id);
    }
  }
  _wljs_scene_initialize(sceneIndex, idsPtr, idsEnd, paramDataPtr, paramDataEndPtr, offsetsPtr, offsetsEndPtr) {
    const cbor = this.HEAPU8.subarray(paramDataPtr, paramDataEndPtr);
    const offsets = this.HEAPU32.subarray(offsetsPtr >>> 2, offsetsEndPtr >>> 2);
    const ids = this.HEAPU16.subarray(idsPtr >>> 1, idsEnd >>> 1);
    const engine2 = this._engine;
    const scene = engine2._scenes[sceneIndex];
    const components = scene._jsComponents;
    let decoded;
    try {
      decoded = CBOR.decode(cbor);
    } catch (e) {
      this._log.error(LogTag.Engine, "Exception during component parameter decoding");
      this._log.error(LogTag.Component, e);
      return;
    }
    if (!Array.isArray(decoded)) {
      this._log.error(LogTag.Engine, "Parameter data must be an array");
      return;
    }
    if (decoded.length !== ids.length) {
      this._log.error(LogTag.Engine, `Parameter data has size ${decoded.length} but expected ${ids.length}`);
      return;
    }
    for (let i = 0; i < decoded.length; ++i) {
      const id = Component._pack(sceneIndex, ids[i]);
      const index = this._wl_get_js_component_index_for_id(id);
      const component = components[index];
      const ctor = component.constructor;
      if (ctor == BrokenComponent)
        continue;
      const paramNames = ctor._propertyOrder;
      const paramValues = decoded[i];
      if (!Array.isArray(paramValues)) {
        this._log.error(LogTag.Engine, "Component parameter data must be an array");
        continue;
      }
      if (paramValues.length !== paramNames.length) {
        this._log.error(LogTag.Engine, `Component parameter data has size ${paramValues.length} but expected ${paramNames.length}`);
        continue;
      }
      for (let j = 0; j < paramValues.length; ++j) {
        const name = paramNames[j];
        const property2 = ctor.Properties[name];
        const type = property2.type;
        let value = paramValues[j];
        if (value === void 0) {
          const cloner = property2.cloner ?? defaultPropertyCloner;
          value = cloner.clone(type, property2.default);
          component[name] = value;
          continue;
        }
        if (typeof value === "number") {
          value += offsets[type];
        }
        switch (type) {
          case Type.Bool:
          case Type.Int:
          case Type.Float:
          case Type.String:
          case Type.Enum:
          case Type.Vector2:
          case Type.Vector3:
          case Type.Vector4:
            break;
          case Type.Object:
            value = value ? scene.wrap(this._wl_object_id(scene._index, value)) : null;
            break;
          case Type.Mesh:
            value = engine2.meshes.wrap(value);
            break;
          case Type.Texture:
            value = engine2.textures.wrap(value);
            break;
          case Type.Material:
            value = engine2.materials.wrap(value);
            break;
          case Type.Animation:
            value = scene.animations.wrap(value);
            break;
          case Type.Skin:
            value = scene.skins.wrap(value);
            break;
          case Type.Color:
            const max2 = (1 << value.BYTES_PER_ELEMENT * 8) - 1;
            value = Float32Array.from(value, (f, _) => f / max2);
            break;
        }
        component[name] = value;
      }
    }
  }
  _wljs_set_component_param_translation(scene, component, param, valuePtr, valueEndPtr) {
    const components = this._engine._scenes[scene]._jsComponents;
    const comp = components[component];
    const value = this.UTF8ViewToString(valuePtr, valueEndPtr);
    const ctor = comp.constructor;
    const paramName = ctor._propertyOrder[param];
    comp[paramName] = value;
  }
  _wljs_get_component_type_index(namePtr, nameEndPtr) {
    const typename = this.UTF8ViewToString(namePtr, nameEndPtr);
    const index = this._componentTypeIndices[typename];
    if (index === void 0) {
      return this._brokenComponentIndex;
    }
    return index;
  }
  _wljs_component_create(sceneIndex, index, id, type, object) {
    const scene = this._engine._scenes[sceneIndex];
    scene._components.createJs(index, id, type, object);
  }
  _wljs_component_init(scene, component) {
    const components = this._engine._scenes[scene]._jsComponents;
    const c = components[component];
    c._triggerInit();
  }
  _wljs_component_update(component, dt) {
    const c = this._components[component];
    c._triggerUpdate(dt);
  }
  _wljs_component_onActivate(component) {
    const c = this._components[component];
    c._triggerOnActivate();
  }
  _wljs_component_onDeactivate(component) {
    const c = this._components[component];
    c._triggerOnDeactivate();
  }
  _wljs_component_markDestroyed(sceneIndex, manager, componentId) {
    const scene = this._engine._scenes[sceneIndex];
    const component = scene._components.get(manager, componentId);
    component?._triggerOnDestroy();
  }
  _wljs_swap(scene, a, b) {
    const components = this._engine._scenes[scene]._jsComponents;
    const componentA = components[a];
    components[a] = components[b];
    components[b] = componentA;
  }
  _wljs_copy(srcSceneIndex, srcIndex, dstSceneIndex, dstIndex, offsetsPtr) {
    const srcScene = this._engine._scenes[srcSceneIndex];
    const dstScene = this._engine._scenes[dstSceneIndex];
    const destComp = dstScene._jsComponents[dstIndex];
    const srcComp = srcScene._jsComponents[srcIndex];
    try {
      destComp._copy(srcComp, offsetsPtr);
    } catch (e) {
      this._log.error(LogTag.Component, `Exception during ${destComp.type} copy() on object ${destComp.object.name}`);
      this._log.error(LogTag.Component, e);
    }
  }
  /**
   * Forward an animation event to a corresponding
   * {@link AnimationComponent}
   *
   * @note This api is meant to be used internally. Please have a look at
   * {@link AnimationComponent.onEvent} instead.
   *
   * @param componentId Component id in the manager
   * @param namePtr Pointer to UTF8 event name
   * @param nameEndPtr Pointer to end of UTF8 event name
   */
  _wljs_trigger_animationEvent(componentId, namePtr, nameEndPtr) {
    const scene = this._engine.scene;
    const comp = scene._components.wrapAnimation(componentId);
    const nameStr = this.UTF8ViewToString(namePtr, nameEndPtr);
    comp.onEvent.notify(nameStr);
  }
};
function throwInvalidRuntime(version) {
  return function() {
    throw new Error(`Feature added in version ${version}.
	\u2192 Please use a Wonderland Engine editor version >= ${version}`);
  };
}
var requireRuntime1_2_1 = throwInvalidRuntime("1.2.1");
WASM.prototype._wl_text_component_get_wrapMode = requireRuntime1_2_1;
WASM.prototype._wl_text_component_set_wrapMode = requireRuntime1_2_1;
WASM.prototype._wl_text_component_get_wrapWidth = requireRuntime1_2_1;
WASM.prototype._wl_text_component_set_wrapWidth = requireRuntime1_2_1;
WASM.prototype._wl_font_get_outlineSize = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_start = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_buffer_size = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_next = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_abort = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_end_prefab = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_end_main = requireRuntime1_2_1;
WASM.prototype._wl_scene_create_chunked_end_queued = requireRuntime1_2_1;

// node_modules/@wonderlandengine/api/dist/version.js
var APIVersion = {
  major: 1,
  minor: 2,
  patch: 1,
  rc: 0
};

// node_modules/@wonderlandengine/api/dist/index.js
var LOADING_SCREEN_PATH = "WonderlandRuntime-LoadingScreen.bin";
function loadScript(scriptURL) {
  return new Promise((res, rej) => {
    const s = document.createElement("script");
    const node = document.body.appendChild(s);
    s.onload = () => {
      document.body.removeChild(node);
      res();
    };
    s.onerror = (e) => {
      document.body.removeChild(node);
      rej(e);
    };
    s.src = scriptURL;
  });
}
async function detectFeatures() {
  let [simdSupported, threadsSupported] = await Promise.all([simd(), threads()]);
  if (simdSupported) {
    console.log("WASM SIMD is supported");
  } else {
    console.warn("WASM SIMD is not supported");
  }
  if (threadsSupported) {
    if (self.crossOriginIsolated) {
      console.log("WASM Threads is supported");
    } else {
      console.warn("WASM Threads is supported, but the page is not crossOriginIsolated, therefore thread support is disabled.");
    }
  } else {
    console.warn("WASM Threads is not supported");
  }
  threadsSupported = threadsSupported && self.crossOriginIsolated;
  return {
    simdSupported,
    threadsSupported
  };
}
var xrSupported = {
  ar: null,
  vr: null
};
function checkXRSupport2() {
  if (typeof navigator === "undefined" || !navigator.xr) {
    xrSupported.vr = false;
    xrSupported.ar = false;
    return Promise.resolve(xrSupported);
  }
  const vrPromise = xrSupported.vr !== null ? Promise.resolve() : navigator.xr.isSessionSupported("immersive-vr").then((supported) => xrSupported.vr = supported).catch(() => xrSupported.vr = false);
  const arPromise = xrSupported.ar !== null ? Promise.resolve() : navigator.xr.isSessionSupported("immersive-ar").then((supported) => xrSupported.ar = supported).catch(() => xrSupported.ar = false);
  return Promise.all([vrPromise, arPromise]).then(() => xrSupported);
}
function checkRuntimeCompatibility(version) {
  const { major, minor } = version;
  let majorDiff = major - APIVersion.major;
  let minorDiff = minor - APIVersion.minor;
  if (!majorDiff && !minorDiff)
    return;
  const error = "checkRuntimeCompatibility(): Version compatibility mismatch:\n	\u2192 API and runtime compatibility is enforced on a patch level (versions x.y.*)\n";
  const isRuntimeOlder = majorDiff < 0 || !majorDiff && minorDiff < 0;
  if (isRuntimeOlder) {
    throw new Error(`${error}	\u2192 Please use a Wonderland Engine editor version >= ${APIVersion.major}.${APIVersion.minor}.*`);
  }
  throw new Error(`${error}	\u2192 Please use a new API version >= ${version.major}.${version.minor}.*`);
}
async function loadRuntime(runtime, options = {}) {
  const xrPromise = checkXRSupport2();
  const baseURL = getBaseUrl(runtime);
  const { simdSupported, threadsSupported } = await detectFeatures();
  const { simd: simd2 = simdSupported, threads: threads2 = threadsSupported, webgpu = false, physx = false, loader = false, xrFramebufferScaleFactor = 1, xrOfferSession = null, loadingScreen = baseURL ? `${baseURL}/${LOADING_SCREEN_PATH}` : LOADING_SCREEN_PATH, canvas: canvas2 = "canvas", logs = [LogLevel.Info, LogLevel.Warn, LogLevel.Error] } = options;
  const variant = [];
  if (webgpu)
    variant.push("webgpu");
  if (loader)
    variant.push("loader");
  if (physx)
    variant.push("physx");
  if (simd2)
    variant.push("simd");
  if (threads2)
    variant.push("threads");
  const variantStr = variant.join("-");
  let filename = runtime;
  if (variantStr)
    filename = `${filename}-${variantStr}`;
  const download = function(filename2, errorMessage) {
    return fetch(filename2).then((r) => {
      if (!r.ok)
        return Promise.reject(errorMessage);
      return r.arrayBuffer();
    }).catch((_) => Promise.reject(errorMessage));
  };
  const [wasmData, loadingScreenData] = await Promise.all([
    download(`${filename}.wasm`, "Failed to fetch runtime .wasm file"),
    download(loadingScreen, "Failed to fetch loading screen file")
  ]);
  const canvasElement = document.getElementById(canvas2);
  if (!canvasElement) {
    throw new Error(`loadRuntime(): Failed to find canvas with id '${canvas2}'`);
  }
  if (!(canvasElement instanceof HTMLCanvasElement)) {
    throw new Error(`loadRuntime(): HTML element '${canvas2}' must be a canvas`);
  }
  const wasm = new WASM(threads2);
  wasm.worker = `${filename}.worker.js`;
  wasm.wasm = wasmData;
  wasm.canvas = canvasElement;
  wasm._log.levels.enable(...logs);
  if (webgpu) {
    const adapter = await navigator.gpu.requestAdapter();
    const desc = {
      requiredFeatures: ["texture-compression-bc"]
    };
    const device = await adapter.requestDevice(desc);
    wasm.preinitializedWebGPUDevice = device;
  }
  const engine2 = new WonderlandEngine(wasm, loadingScreenData);
  if (!window._WL) {
    window._WL = { runtimes: {} };
  }
  const runtimes = window._WL.runtimes;
  const runtimeGlobalId = variantStr ? variantStr : "default";
  if (!runtimes[runtimeGlobalId]) {
    await loadScript(`${filename}.js`);
    runtimes[runtimeGlobalId] = window.instantiateWonderlandRuntime;
    window.instantiateWonderlandRuntime = void 0;
  }
  await runtimes[runtimeGlobalId](wasm);
  engine2._init();
  checkRuntimeCompatibility(engine2.runtimeVersion);
  const xr = await xrPromise;
  engine2.arSupported = xr.ar;
  engine2.vrSupported = xr.vr;
  engine2.xrFramebufferScaleFactor = xrFramebufferScaleFactor;
  engine2.autoResizeCanvas = true;
  engine2.start();
  if (xrOfferSession !== null) {
    let mode = xrOfferSession.mode;
    if (mode == "auto") {
      if (engine2.vrSupported) {
        mode = "immersive-vr";
      } else if (engine2.arSupported) {
        mode = "immersive-ar";
      } else {
        mode = "inline";
      }
    }
    const offerSession = function() {
      engine2.offerXRSession(mode, xrOfferSession.features, xrOfferSession.optionalFeatures).then(
        /* When the session ends, offer to start a new one again */
        (s) => s.addEventListener("end", offerSession)
      ).catch(console.warn);
    };
    offerSession();
  }
  return engine2;
}

// node_modules/@wonderlandengine/components/dist/8thwall-camera.js
var ARCamera8thwall = class extends Component {
  /* 8thwall camera pipeline module name */
  name = "wonderland-engine-8thwall-camera";
  started = false;
  view = null;
  // cache camera
  position = [0, 0, 0];
  // cache 8thwall cam position
  rotation = [0, 0, 0, -1];
  // cache 8thwall cam rotation
  glTextureRenderer = null;
  // cache XR8.GlTextureRenderer.pipelineModule
  promptForDeviceMotion() {
    return new Promise(async (resolve, reject) => {
      window.dispatchEvent(new Event("8thwall-request-user-interaction"));
      window.addEventListener("8thwall-safe-to-request-permissions", async () => {
        try {
          const motionEvent = await DeviceMotionEvent.requestPermission();
          resolve(motionEvent);
        } catch (exception) {
          reject(exception);
        }
      });
    });
  }
  async getPermissions() {
    if (DeviceMotionEvent && DeviceMotionEvent.requestPermission) {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result !== "granted") {
          throw new Error("MotionEvent");
        }
      } catch (exception) {
        if (exception.name === "NotAllowedError") {
          const motionEvent = await this.promptForDeviceMotion();
          if (motionEvent !== "granted") {
            throw new Error("MotionEvent");
          }
        } else {
          throw new Error("MotionEvent");
        }
      }
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (exception) {
      throw new Error("Camera");
    }
  }
  init() {
    this.view = this.object.getComponent("view");
    this.onUpdate = this.onUpdate.bind(this);
    this.onAttach = this.onAttach.bind(this);
    this.onException = this.onException.bind(this);
    this.onCameraStatusChange = this.onCameraStatusChange.bind(this);
  }
  async start() {
    this.view = this.object.getComponent("view");
    if (!this.useCustomUIOverlays) {
      OverlaysHandler.init();
    }
    try {
      await this.getPermissions();
    } catch (error) {
      window.dispatchEvent(new CustomEvent("8thwall-permission-fail", { detail: error }));
      return;
    }
    await this.waitForXR8();
    XR8.XrController.configure({
      disableWorldTracking: false
    });
    this.glTextureRenderer = XR8.GlTextureRenderer.pipelineModule();
    XR8.addCameraPipelineModules([
      this.glTextureRenderer,
      XR8.XrController.pipelineModule(),
      this
    ]);
    const config = {
      cameraConfig: {
        direction: XR8.XrConfig.camera().BACK
      },
      canvas: Module.canvas,
      allowedDevices: XR8.XrConfig.device().ANY,
      ownRunLoop: false
    };
    XR8.run(config);
  }
  /**
   * @private
   * 8thwall pipeline function
   */
  onAttach(params) {
    this.started = true;
    this.engine.scene.colorClearEnabled = false;
    const gl = Module.ctx;
    const rot = this.object.rotationWorld;
    const pos = this.object.getTranslationWorld([]);
    this.position = Array.from(pos);
    this.rotation = Array.from(rot);
    XR8.XrController.updateCameraProjectionMatrix({
      origin: { x: pos[0], y: pos[1], z: pos[2] },
      facing: { x: rot[0], y: rot[1], z: rot[2], w: rot[3] },
      cam: {
        pixelRectWidth: Module.canvas.width,
        pixelRectHeight: Module.canvas.height,
        nearClipPlane: this.view.near,
        farClipPlane: this.view.far
      }
    });
    this.engine.scene.onPreRender.push(() => {
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
      XR8.runPreRender(Date.now());
      XR8.runRender();
    });
    this.engine.scene.onPostRender.push(() => {
      XR8.runPostRender(Date.now());
    });
  }
  /**
   * @private
   * 8thwall pipeline function
   */
  onCameraStatusChange(e) {
    if (e && e.status === "failed") {
      this.onException(new Error(`Camera failed with status: ${e.status}`));
    }
  }
  /**
   * @private
   * 8thwall pipeline function
   */
  onUpdate(e) {
    if (!e.processCpuResult.reality)
      return;
    const { rotation, position, intrinsics } = e.processCpuResult.reality;
    this.rotation[0] = rotation.x;
    this.rotation[1] = rotation.y;
    this.rotation[2] = rotation.z;
    this.rotation[3] = rotation.w;
    this.position[0] = position.x;
    this.position[1] = position.y;
    this.position[2] = position.z;
    if (intrinsics) {
      const projectionMatrix = this.view.projectionMatrix;
      for (let i = 0; i < 16; i++) {
        if (Number.isFinite(intrinsics[i])) {
          projectionMatrix[i] = intrinsics[i];
        }
      }
    }
    if (position && rotation) {
      this.object.rotationWorld = this.rotation;
      this.object.setTranslationWorld(this.position);
    }
  }
  /**
   * @private
   * 8thwall pipeline function
   */
  onException(error) {
    console.error("8thwall exception:", error);
    window.dispatchEvent(new CustomEvent("8thwall-error", { detail: error }));
  }
  waitForXR8() {
    return new Promise((resolve, _rej) => {
      if (window.XR8) {
        resolve();
      } else {
        window.addEventListener("xrloaded", () => resolve());
      }
    });
  }
};
__publicField(ARCamera8thwall, "TypeName", "8thwall-camera");
__publicField(ARCamera8thwall, "Properties", {
  /** Override the WL html overlays for handling camera/motion permissions and error handling */
  useCustomUIOverlays: { type: Type.Bool, default: false }
});
var OverlaysHandler = {
  init: function() {
    this.handleRequestUserInteraction = this.handleRequestUserInteraction.bind(this);
    this.handlePermissionFail = this.handlePermissionFail.bind(this);
    this.handleError = this.handleError.bind(this);
    window.addEventListener("8thwall-request-user-interaction", this.handleRequestUserInteraction);
    window.addEventListener("8thwall-permission-fail", this.handlePermissionFail);
    window.addEventListener("8thwall-error", this.handleError);
  },
  handleRequestUserInteraction: function() {
    const overlay = this.showOverlay(requestPermissionOverlay);
    window.addEventListener("8thwall-safe-to-request-permissions", () => {
      overlay.remove();
    });
  },
  handlePermissionFail: function(_reason) {
    this.showOverlay(failedPermissionOverlay);
  },
  handleError: function(_error) {
    this.showOverlay(runtimeErrorOverlay);
  },
  showOverlay: function(htmlContent) {
    const overlay = document.createElement("div");
    overlay.innerHTML = htmlContent;
    document.body.appendChild(overlay);
    return overlay;
  }
};
var requestPermissionOverlay = `
<style>
  #request-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .request-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .request-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="request-permission-overlay">
  <div class="request-permission-overlay_title">This app requires to use your camera and motion sensors</div>

  <button class="request-permission-overlay_button" onclick="window.dispatchEvent(new Event('8thwall-safe-to-request-permissions'))">OK</button>
</div>`;
var failedPermissionOverlay = `
<style>
  #failed-permission-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .failed-permission-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .failed-permission-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="failed-permission-overlay">
  <div class="failed-permission-overlay_title">Failed to grant permissions. Reset the the permissions and refresh the page.</div>

  <button class="failed-permission-overlay_button" onclick="window.location.reload()">Refresh the page</button>
</div>`;
var runtimeErrorOverlay = `
<style>
  #wall-error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    font-family: sans-serif;
  }

  .wall-error-overlay_title {
    margin: 30px;
    font-size: 32px;
  }

  .wall-error-overlay_button {
    background-color: #e80086;
    font-size: 22px;
    padding: 10px 30px;
    color: #fff;
    border-radius: 15px;
    border: none;
  }
</style>

<div id="wall-error-overlay">
  <div class="wall-error-overlay_title">Error has occurred. Please reload the page</div>

  <button class="wall-error-overlay_button" onclick="window.location.reload()">Reload</button>
</div>`;

// node_modules/@wonderlandengine/components/dist/utils/webxr.js
var tempVec = new Float32Array(3);
var tempQuat = new Float32Array(4);
function setXRRigidTransformLocal(o, transform) {
  const r = transform.orientation;
  tempQuat[0] = r.x;
  tempQuat[1] = r.y;
  tempQuat[2] = r.z;
  tempQuat[3] = r.w;
  const t = transform.position;
  tempVec[0] = t.x;
  tempVec[1] = t.y;
  tempVec[2] = t.z;
  o.resetPositionRotation();
  o.setRotationLocal(tempQuat);
  o.translateLocal(tempVec);
}

// node_modules/@wonderlandengine/components/dist/anchor.js
var __decorate2 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var tempVec3 = new Float32Array(3);
var tempQuat2 = new Float32Array(4);
var _anchors, _addAnchor, addAnchor_fn, _removeAnchor, removeAnchor_fn, _getFrame, getFrame_fn, _createAnchor, createAnchor_fn, _onAddAnchor, onAddAnchor_fn, _onRestoreAnchor, onRestoreAnchor_fn, _onCreate, onCreate_fn;
var _Anchor = class extends Component {
  constructor() {
    super(...arguments);
    __privateAdd(this, _getFrame);
    __privateAdd(this, _createAnchor);
    __privateAdd(this, _onAddAnchor);
    __privateAdd(this, _onRestoreAnchor);
    __privateAdd(this, _onCreate);
    __publicField(this, "persist", false);
    /** Unique identifier to load a persistent anchor from, or empty/null if unknown */
    __publicField(this, "uuid", null);
    /** The xrAnchor, if created */
    __publicField(this, "xrAnchor", null);
    /** Emits events when the anchor is created either by being restored or newly created */
    __publicField(this, "onCreate", new Emitter());
    /** Whether the anchor is currently being tracked */
    __publicField(this, "visible", false);
    /** Emits an event when this anchor starts tracking */
    __publicField(this, "onTrackingFound", new Emitter());
    /** Emits an event when this anchor stops tracking */
    __publicField(this, "onTrackingLost", new Emitter());
    /** XRFrame to use for creating the anchor */
    __publicField(this, "xrFrame", null);
    /** XRHitTestResult to use for creating the anchor */
    __publicField(this, "xrHitResult", null);
  }
  /** Retrieve all anchors of the current scene */
  static getAllAnchors() {
    return __privateGet(_Anchor, _anchors);
  }
  /**
   * Create a new anchor
   *
   * @param o Object to attach the component to
   * @param params Parameters for the anchor component
   * @param frame XRFrame to use for anchor cration, if null, will use the current frame if available
   * @param hitResult Optional hit-test result to create the anchor with
   * @returns Promise for the newly created anchor component
   */
  static create(o, params, frame, hitResult) {
    const a = o.addComponent(_Anchor, { ...params, active: false });
    if (a === null)
      return null;
    a.xrHitResult = hitResult ?? null;
    a.xrFrame = frame ?? null;
    a.onCreate.once(() => (a.xrFrame = null, a.xrHitResult = null));
    a.active = true;
    return a.onCreate.promise();
  }
  start() {
    if (this.uuid && this.engine.xr) {
      this.persist = true;
      if (this.engine.xr.session.restorePersistentAnchor === void 0) {
        console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
      }
      this.engine.xr.session.restorePersistentAnchor(this.uuid).then(__privateMethod(this, _onRestoreAnchor, onRestoreAnchor_fn).bind(this));
    } else if (__privateMethod(this, _getFrame, getFrame_fn).call(this)) {
      __privateMethod(this, _createAnchor, createAnchor_fn).call(this).then(__privateMethod(this, _onAddAnchor, onAddAnchor_fn).bind(this));
    } else {
      throw new Error("Anchors can only be created during the XR frame in an active XR session");
    }
  }
  update() {
    if (!this.xrAnchor || !this.engine.xr)
      return;
    const pose = this.engine.xr.frame.getPose(this.xrAnchor.anchorSpace, this.engine.xr.currentReferenceSpace);
    const visible = !!pose;
    if (visible != this.visible) {
      this.visible = visible;
      (visible ? this.onTrackingFound : this.onTrackingLost).notify(this);
    }
    if (pose) {
      setXRRigidTransformLocal(this.object, pose.transform);
    }
  }
  onDestroy() {
    var _a;
    __privateMethod(_a = _Anchor, _removeAnchor, removeAnchor_fn).call(_a, this);
  }
};
var Anchor = _Anchor;
_anchors = new WeakMap();
_addAnchor = new WeakSet();
addAnchor_fn = function(anchor) {
  __privateGet(_Anchor, _anchors).push(anchor);
};
_removeAnchor = new WeakSet();
removeAnchor_fn = function(anchor) {
  const index = __privateGet(_Anchor, _anchors).indexOf(anchor);
  if (index < 0)
    return;
  __privateGet(_Anchor, _anchors).splice(index, 1);
};
_getFrame = new WeakSet();
getFrame_fn = function() {
  return this.xrFrame || this.engine.xr.frame;
};
_createAnchor = new WeakSet();
createAnchor_fn = async function() {
  if (!__privateMethod(this, _getFrame, getFrame_fn).call(this).createAnchor) {
    throw new Error("Cannot create anchor - anchors not supported, did you enable the 'anchors' WebXR feature?");
  }
  if (this.xrHitResult) {
    if (this.xrHitResult.createAnchor === void 0) {
      throw new Error("Requested anchor on XRHitTestResult, but WebXR hit-test feature is not available.");
    }
    return this.xrHitResult.createAnchor();
  } else {
    this.object.getTranslationWorld(tempVec3);
    tempQuat2.set(this.object.rotationWorld);
    const rotation = tempQuat2;
    const anchorPose = new XRRigidTransform({ x: tempVec3[0], y: tempVec3[1], z: tempVec3[2] }, { x: rotation[0], y: rotation[1], z: rotation[2], w: rotation[3] });
    return __privateMethod(this, _getFrame, getFrame_fn).call(this)?.createAnchor(anchorPose, this.engine.xr.currentReferenceSpace);
  }
};
_onAddAnchor = new WeakSet();
onAddAnchor_fn = function(anchor) {
  if (!anchor)
    return;
  if (this.persist) {
    if (anchor.requestPersistentHandle !== void 0) {
      anchor.requestPersistentHandle().then((uuid) => {
        var _a;
        this.uuid = uuid;
        __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
        __privateMethod(_a = _Anchor, _addAnchor, addAnchor_fn).call(_a, this);
      });
      return;
    } else {
      console.warn("anchor: Persistent anchors are not supported by your client. Ignoring persist property.");
    }
  }
  __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
};
_onRestoreAnchor = new WeakSet();
onRestoreAnchor_fn = function(anchor) {
  __privateMethod(this, _onCreate, onCreate_fn).call(this, anchor);
};
_onCreate = new WeakSet();
onCreate_fn = function(anchor) {
  this.xrAnchor = anchor;
  this.onCreate.notify(this);
};
__privateAdd(Anchor, _addAnchor);
__privateAdd(Anchor, _removeAnchor);
__publicField(Anchor, "TypeName", "anchor");
/* Static management of all anchors */
__privateAdd(Anchor, _anchors, []);
__decorate2([
  property.bool(false)
], Anchor.prototype, "persist", void 0);
__decorate2([
  property.string()
], Anchor.prototype, "uuid", void 0);

// node_modules/@wonderlandengine/components/dist/cursor-target.js
var CursorTarget = class extends Component {
  /** Emitter for events when the target is hovered */
  onHover = new Emitter();
  /** Emitter for events when the target is unhovered */
  onUnhover = new Emitter();
  /** Emitter for events when the target is clicked */
  onClick = new Emitter();
  /** Emitter for events when the cursor moves on the target */
  onMove = new Emitter();
  /** Emitter for events when the user pressed the select button on the target */
  onDown = new Emitter();
  /** Emitter for events when the user unpressed the select button on the target */
  onUp = new Emitter();
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    this.onHover.add(f);
   */
  addHoverFunction(f) {
    this.onHover.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    this.onHover.remove(f);
   */
  removeHoverFunction(f) {
    this.onHover.remove(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    this.onUnhover.add(f);
   */
  addUnHoverFunction(f) {
    this.onUnhover.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    this.onUnhover.remove(f);
   */
  removeUnHoverFunction(f) {
    this.onUnhover.remove(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    this.onClick.add(f);
   */
  addClickFunction(f) {
    this.onClick.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onClick.remove(f);
   */
  removeClickFunction(f) {
    this.onClick.remove(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onMove.add(f);
   */
  addMoveFunction(f) {
    this.onMove.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onMove.remove(f);
   */
  removeMoveFunction(f) {
    this.onMove.remove(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onDown.add(f);
   */
  addDownFunction(f) {
    this.onDown.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onDown.remove(f);
   */
  removeDownFunction(f) {
    this.onDown.remove(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onUp.add(f);
   */
  addUpFunction(f) {
    this.onUp.add(f);
  }
  /**
   * @deprecated Use the emitter instead.
   *
   * @example
   *    component.onUp.remove(f);
   */
  removeUpFunction(f) {
    this.onUp.remove(f);
  }
};
__publicField(CursorTarget, "TypeName", "cursor-target");
__publicField(CursorTarget, "Properties", {});

// node_modules/gl-matrix/esm/common.js
var EPSILON = 1e-6;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
var degree = Math.PI / 180;
if (!Math.hypot)
  Math.hypot = function() {
    var y = 0, i = arguments.length;
    while (i--) {
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };

// node_modules/gl-matrix/esm/mat3.js
function create() {
  var out = new ARRAY_TYPE(9);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}

// node_modules/gl-matrix/esm/mat4.js
var mat4_exports = {};
__export(mat4_exports, {
  add: () => add,
  adjoint: () => adjoint,
  clone: () => clone,
  copy: () => copy,
  create: () => create2,
  determinant: () => determinant,
  equals: () => equals,
  exactEquals: () => exactEquals,
  frob: () => frob,
  fromQuat: () => fromQuat,
  fromQuat2: () => fromQuat2,
  fromRotation: () => fromRotation,
  fromRotationTranslation: () => fromRotationTranslation,
  fromRotationTranslationScale: () => fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: () => fromRotationTranslationScaleOrigin,
  fromScaling: () => fromScaling,
  fromTranslation: () => fromTranslation,
  fromValues: () => fromValues,
  fromXRotation: () => fromXRotation,
  fromYRotation: () => fromYRotation,
  fromZRotation: () => fromZRotation,
  frustum: () => frustum,
  getRotation: () => getRotation,
  getScaling: () => getScaling,
  getTranslation: () => getTranslation,
  identity: () => identity,
  invert: () => invert,
  lookAt: () => lookAt,
  mul: () => mul,
  multiply: () => multiply,
  multiplyScalar: () => multiplyScalar,
  multiplyScalarAndAdd: () => multiplyScalarAndAdd,
  ortho: () => ortho,
  orthoNO: () => orthoNO,
  orthoZO: () => orthoZO,
  perspective: () => perspective,
  perspectiveFromFieldOfView: () => perspectiveFromFieldOfView,
  perspectiveNO: () => perspectiveNO,
  perspectiveZO: () => perspectiveZO,
  rotate: () => rotate,
  rotateX: () => rotateX,
  rotateY: () => rotateY,
  rotateZ: () => rotateZ,
  scale: () => scale,
  set: () => set,
  str: () => str,
  sub: () => sub,
  subtract: () => subtract,
  targetTo: () => targetTo,
  translate: () => translate,
  transpose: () => transpose
});
function create2() {
  var out = new ARRAY_TYPE(16);
  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
function clone(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function transpose(out, a) {
  if (out === a) {
    var a01 = a[1], a02 = a[2], a03 = a[3];
    var a12 = a[6], a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }
  return out;
}
function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function adjoint(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
function determinant(a) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply(out, a, b) {
  var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale(out, a, v) {
  var x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len4 = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;
  if (len4 < EPSILON) {
    return null;
  }
  len4 = 1 / len4;
  x *= len4;
  y *= len4;
  z *= len4;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];
  if (a !== out) {
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  if (a !== out) {
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotation(out, rad, axis) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len4 = Math.hypot(x, y, z);
  var s, c, t;
  if (len4 < EPSILON) {
    return null;
  }
  len4 = 1 / len4;
  x *= len4;
  y *= len4;
  z *= len4;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function fromRotationTranslation(out, q, v) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw;
  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }
  fromRotationTranslation(out, a, translation);
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;
  if (trace > 0) {
    S = Math.sqrt(trace + 1) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }
  return out;
}
function fromRotationTranslationScale(out, q, v, s) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
function fromQuat(out, q) {
  var x = q[0], y = q[1], z = q[2], w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }
  return out;
}
var perspective = perspectiveNO;
function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy / 2), nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;
  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }
  return out;
}
function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
  var xScale = 2 / (leftTan + rightTan);
  var yScale = 2 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = yScale;
  out[6] = 0;
  out[7] = 0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near / (near - far);
  out[15] = 0;
  return out;
}
function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
var ortho = orthoNO;
function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len4;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];
  if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
    return identity(out);
  }
  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len4 = 1 / Math.hypot(z0, z1, z2);
  z0 *= len4;
  z1 *= len4;
  z2 *= len4;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len4 = Math.hypot(x0, x1, x2);
  if (!len4) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len4 = 1 / len4;
    x0 *= len4;
    x1 *= len4;
    x2 *= len4;
  }
  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len4 = Math.hypot(y0, y1, y2);
  if (!len4) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len4 = 1 / len4;
    y0 *= len4;
    y1 *= len4;
    y2 *= len4;
  }
  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  var len4 = z0 * z0 + z1 * z1 + z2 * z2;
  if (len4 > 0) {
    len4 = 1 / Math.sqrt(len4);
    z0 *= len4;
    z1 *= len4;
    z2 *= len4;
  }
  var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len4 = x0 * x0 + x1 * x1 + x2 * x2;
  if (len4 > 0) {
    len4 = 1 / Math.sqrt(len4);
    x0 *= len4;
    x1 *= len4;
    x2 *= len4;
  }
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function str(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
function multiplyScalarAndAdd(out, a, b, scale6) {
  out[0] = a[0] + b[0] * scale6;
  out[1] = a[1] + b[1] * scale6;
  out[2] = a[2] + b[2] * scale6;
  out[3] = a[3] + b[3] * scale6;
  out[4] = a[4] + b[4] * scale6;
  out[5] = a[5] + b[5] * scale6;
  out[6] = a[6] + b[6] * scale6;
  out[7] = a[7] + b[7] * scale6;
  out[8] = a[8] + b[8] * scale6;
  out[9] = a[9] + b[9] * scale6;
  out[10] = a[10] + b[10] * scale6;
  out[11] = a[11] + b[11] * scale6;
  out[12] = a[12] + b[12] * scale6;
  out[13] = a[13] + b[13] * scale6;
  out[14] = a[14] + b[14] * scale6;
  out[15] = a[15] + b[15] * scale6;
  return out;
}
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
function equals(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
  var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  var b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  var b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11];
  var b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
}
var mul = multiply;
var sub = subtract;

// node_modules/gl-matrix/esm/quat.js
var quat_exports = {};
__export(quat_exports, {
  add: () => add4,
  calculateW: () => calculateW,
  clone: () => clone4,
  conjugate: () => conjugate,
  copy: () => copy4,
  create: () => create5,
  dot: () => dot3,
  equals: () => equals4,
  exactEquals: () => exactEquals4,
  exp: () => exp,
  fromEuler: () => fromEuler,
  fromMat3: () => fromMat3,
  fromValues: () => fromValues4,
  getAngle: () => getAngle,
  getAxisAngle: () => getAxisAngle,
  identity: () => identity2,
  invert: () => invert2,
  len: () => len2,
  length: () => length3,
  lerp: () => lerp3,
  ln: () => ln,
  mul: () => mul3,
  multiply: () => multiply3,
  normalize: () => normalize3,
  pow: () => pow,
  random: () => random2,
  rotateX: () => rotateX3,
  rotateY: () => rotateY3,
  rotateZ: () => rotateZ3,
  rotationTo: () => rotationTo,
  scale: () => scale4,
  set: () => set4,
  setAxes: () => setAxes,
  setAxisAngle: () => setAxisAngle,
  slerp: () => slerp,
  sqlerp: () => sqlerp,
  sqrLen: () => sqrLen2,
  squaredLength: () => squaredLength3,
  str: () => str3
});

// node_modules/gl-matrix/esm/vec3.js
var vec3_exports = {};
__export(vec3_exports, {
  add: () => add2,
  angle: () => angle,
  bezier: () => bezier,
  ceil: () => ceil,
  clone: () => clone2,
  copy: () => copy2,
  create: () => create3,
  cross: () => cross,
  dist: () => dist,
  distance: () => distance,
  div: () => div,
  divide: () => divide,
  dot: () => dot,
  equals: () => equals2,
  exactEquals: () => exactEquals2,
  floor: () => floor,
  forEach: () => forEach,
  fromValues: () => fromValues2,
  hermite: () => hermite,
  inverse: () => inverse,
  len: () => len,
  length: () => length,
  lerp: () => lerp,
  max: () => max,
  min: () => min,
  mul: () => mul2,
  multiply: () => multiply2,
  negate: () => negate,
  normalize: () => normalize,
  random: () => random,
  rotateX: () => rotateX2,
  rotateY: () => rotateY2,
  rotateZ: () => rotateZ2,
  round: () => round,
  scale: () => scale2,
  scaleAndAdd: () => scaleAndAdd,
  set: () => set2,
  sqrDist: () => sqrDist,
  sqrLen: () => sqrLen,
  squaredDistance: () => squaredDistance,
  squaredLength: () => squaredLength,
  str: () => str2,
  sub: () => sub2,
  subtract: () => subtract2,
  transformMat3: () => transformMat3,
  transformMat4: () => transformMat4,
  transformQuat: () => transformQuat,
  zero: () => zero
});
function create3() {
  var out = new ARRAY_TYPE(3);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}
function clone2(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
function fromValues2(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function copy2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set2(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply2(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
function scale2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function scaleAndAdd(out, a, b, scale6) {
  out[0] = a[0] + b[0] * scale6;
  out[1] = a[1] + b[1] * scale6;
  out[2] = a[2] + b[2] * scale6;
  return out;
}
function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len4 = x * x + y * y + z * z;
  if (len4 > 0) {
    len4 = 1 / Math.sqrt(len4);
  }
  out[0] = a[0] * len4;
  out[1] = a[1] * len4;
  out[2] = a[2] * len4;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2];
  var bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
function random(out, scale6) {
  scale6 = scale6 || 1;
  var r = RANDOM() * 2 * Math.PI;
  var z = RANDOM() * 2 - 1;
  var zScale = Math.sqrt(1 - z * z) * scale6;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale6;
  return out;
}
function transformMat4(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  var x = a[0], y = a[1], z = a[2];
  var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
  var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
function rotateX2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateY2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function rotateZ2(out, a, b, rad) {
  var p = [], r = [];
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];
  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2];
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
function angle(a, b) {
  var ax = a[0], ay = a[1], az = a[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
function zero(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}
function str2(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
function exactEquals2(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
function equals2(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2];
  var b0 = b[0], b1 = b[1], b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2));
}
var sub2 = subtract2;
var mul2 = multiply2;
var div = divide;
var dist = distance;
var sqrDist = squaredDistance;
var len = length;
var sqrLen = squaredLength;
var forEach = function() {
  var vec = create3();
  return function(a, stride, offset2, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 3;
    }
    if (!offset2) {
      offset2 = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset2, a.length);
    } else {
      l = a.length;
    }
    for (i = offset2; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }
    return a;
  };
}();

// node_modules/gl-matrix/esm/vec4.js
function create4() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }
  return out;
}
function clone3(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function fromValues3(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function copy3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set3(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function add3(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
function scale3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
function length2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
function squaredLength2(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
function normalize2(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len4 = x * x + y * y + z * z + w * w;
  if (len4 > 0) {
    len4 = 1 / Math.sqrt(len4);
  }
  out[0] = x * len4;
  out[1] = y * len4;
  out[2] = z * len4;
  out[3] = w * len4;
  return out;
}
function dot2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function lerp2(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
function exactEquals3(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function equals3(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
}
var forEach2 = function() {
  var vec = create4();
  return function(a, stride, offset2, count, fn, arg) {
    var i, l;
    if (!stride) {
      stride = 4;
    }
    if (!offset2) {
      offset2 = 0;
    }
    if (count) {
      l = Math.min(count * stride + offset2, a.length);
    } else {
      l = a.length;
    }
    for (i = offset2; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }
    return a;
  };
}();

// node_modules/gl-matrix/esm/quat.js
function create5() {
  var out = new ARRAY_TYPE(4);
  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  out[3] = 1;
  return out;
}
function identity2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2;
  var s = Math.sin(rad / 2);
  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}
function getAngle(a, b) {
  var dotproduct = dot3(a, b);
  return Math.acos(2 * dotproduct * dotproduct - 1);
}
function multiply3(out, a, b) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX3(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY3(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ3(out, a, rad) {
  rad *= 0.5;
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function calculateW(out, a) {
  var x = a[0], y = a[1], z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1 - x * x - y * y - z * z));
  return out;
}
function exp(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var et = Math.exp(w);
  var s = r > 0 ? et * Math.sin(r) / r : 0;
  out[0] = x * s;
  out[1] = y * s;
  out[2] = z * s;
  out[3] = et * Math.cos(r);
  return out;
}
function ln(out, a) {
  var x = a[0], y = a[1], z = a[2], w = a[3];
  var r = Math.sqrt(x * x + y * y + z * z);
  var t = r > 0 ? Math.atan2(r, w) / r : 0;
  out[0] = x * t;
  out[1] = y * t;
  out[2] = z * t;
  out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
  return out;
}
function pow(out, a, b) {
  ln(out, a);
  scale4(out, out, b);
  exp(out, out);
  return out;
}
function slerp(out, a, b, t) {
  var ax = a[0], ay = a[1], az = a[2], aw = a[3];
  var bx = b[0], by = b[1], bz = b[2], bw = b[3];
  var omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > EPSILON) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function random2(out) {
  var u1 = RANDOM();
  var u2 = RANDOM();
  var u3 = RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
  return out;
}
function invert2(out, a) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  var dot5 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot5 ? 1 / dot5 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    var i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, x, y, z) {
  var halfToRad = 0.5 * Math.PI / 180;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
function str3(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
var clone4 = clone3;
var fromValues4 = fromValues3;
var copy4 = copy3;
var set4 = set3;
var add4 = add3;
var mul3 = multiply3;
var scale4 = scale3;
var dot3 = dot2;
var lerp3 = lerp2;
var length3 = length2;
var len2 = length3;
var squaredLength3 = squaredLength2;
var sqrLen2 = squaredLength3;
var normalize3 = normalize2;
var exactEquals4 = exactEquals3;
var equals4 = equals3;
var rotationTo = function() {
  var tmpvec3 = create3();
  var xUnitVec3 = fromValues2(1, 0, 0);
  var yUnitVec3 = fromValues2(0, 1, 0);
  return function(out, a, b) {
    var dot5 = dot(a, b);
    if (dot5 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 1e-6)
        cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot5 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot5;
      return normalize3(out, out);
    }
  };
}();
var sqlerp = function() {
  var temp1 = create5();
  var temp2 = create5();
  return function(out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
}();
var setAxes = function() {
  var matr = create();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize3(out, fromMat3(out, matr));
  };
}();

// node_modules/gl-matrix/esm/quat2.js
var quat2_exports = {};
__export(quat2_exports, {
  add: () => add5,
  clone: () => clone5,
  conjugate: () => conjugate2,
  copy: () => copy5,
  create: () => create6,
  dot: () => dot4,
  equals: () => equals5,
  exactEquals: () => exactEquals5,
  fromMat4: () => fromMat4,
  fromRotation: () => fromRotation2,
  fromRotationTranslation: () => fromRotationTranslation2,
  fromRotationTranslationValues: () => fromRotationTranslationValues,
  fromTranslation: () => fromTranslation2,
  fromValues: () => fromValues5,
  getDual: () => getDual,
  getReal: () => getReal,
  getTranslation: () => getTranslation2,
  identity: () => identity3,
  invert: () => invert3,
  len: () => len3,
  length: () => length4,
  lerp: () => lerp4,
  mul: () => mul4,
  multiply: () => multiply4,
  normalize: () => normalize4,
  rotateAroundAxis: () => rotateAroundAxis,
  rotateByQuatAppend: () => rotateByQuatAppend,
  rotateByQuatPrepend: () => rotateByQuatPrepend,
  rotateX: () => rotateX4,
  rotateY: () => rotateY4,
  rotateZ: () => rotateZ4,
  scale: () => scale5,
  set: () => set5,
  setDual: () => setDual,
  setReal: () => setReal,
  sqrLen: () => sqrLen3,
  squaredLength: () => squaredLength4,
  str: () => str4,
  translate: () => translate2
});
function create6() {
  var dq = new ARRAY_TYPE(8);
  if (ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }
  dq[3] = 1;
  return dq;
}
function clone5(a) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
function fromValues5(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
function fromRotationTranslation2(out, q, t) {
  var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q[0], by = q[1], bz = q[2], bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
function fromTranslation2(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
function fromRotation2(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
function fromMat4(out, a) {
  var outer = create5();
  getRotation(outer, a);
  var t = new ARRAY_TYPE(3);
  getTranslation(t, a);
  fromRotationTranslation2(out, outer, t);
  return out;
}
function copy5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  return out;
}
function identity3(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
function set5(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
var getReal = copy4;
function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
var setReal = copy4;
function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
function getTranslation2(out, a) {
  var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
function translate2(out, a, v) {
  var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v[0] * 0.5, by1 = v[1] * 0.5, bz1 = v[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
function rotateX4(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateX3(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateY4(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateY3(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateZ4(out, a, rad) {
  var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateZ3(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
function rotateByQuatAppend(out, a, q) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
function rotateByQuatPrepend(out, q, a) {
  var qx = q[0], qy = q[1], qz = q[2], qw = q[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
function rotateAroundAxis(out, a, axis, rad) {
  if (Math.abs(rad) < EPSILON) {
    return copy5(out, a);
  }
  var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = s * axis[0] / axisLength;
  var by = s * axis[1] / axisLength;
  var bz = s * axis[2] / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4], ay = a[5], az = a[6], aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function add5(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  return out;
}
function multiply4(out, a, b) {
  var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b[4], by1 = b[5], bz1 = b[6], bw1 = b[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b[0], by0 = b[1], bz0 = b[2], bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
  out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
  out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
  out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
  return out;
}
var mul4 = multiply4;
function scale5(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
var dot4 = dot3;
function lerp4(out, a, b, t) {
  var mt = 1 - t;
  if (dot4(a, b) < 0)
    t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
function invert3(out, a) {
  var sqlen = squaredLength4(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
function conjugate2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
var length4 = length3;
var len3 = length4;
var squaredLength4 = squaredLength3;
var sqrLen3 = squaredLength4;
function normalize4(out, a) {
  var magnitude = squaredLength4(a);
  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }
  return out;
}
function str4(a) {
  return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
}
function exactEquals5(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7];
}
function equals5(a, b) {
  var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
  var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7];
  return Math.abs(a0 - b0) <= EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON * Math.max(1, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
}

// node_modules/@wonderlandengine/components/dist/hit-test-location.js
var __decorate3 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HitTestLocation = class extends Component {
  tempScaling = new Float32Array(3);
  visible = false;
  xrHitTestSource = null;
  /** Reference space for creating the hit test when the session starts */
  xrReferenceSpace = null;
  /**
   * For maintaining backwards compatibility: Whether to scale the object to 0 and back.
   * @deprecated Use onHitLost and onHitFound instead.
   */
  scaleObject = true;
  /** Emits an event when the hit test switches from visible to invisible */
  onHitLost = new Emitter();
  /** Emits an event when the hit test switches from invisible to visible */
  onHitFound = new Emitter();
  onSessionStartCallback = null;
  onSessionEndCallback = null;
  start() {
    this.onSessionStartCallback = this.onXRSessionStart.bind(this);
    this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    if (this.scaleObject) {
      this.tempScaling.set(this.object.scalingLocal);
      this.object.scale([0, 0, 0]);
      this.onHitLost.add(() => {
        this.tempScaling.set(this.object.scalingLocal);
        this.object.scale([0, 0, 0]);
      });
      this.onHitFound.add(() => {
        this.object.scalingLocal.set(this.tempScaling);
        this.object.setDirty();
      });
    }
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
  }
  update() {
    const wasVisible = this.visible;
    if (this.xrHitTestSource) {
      const frame = this.engine.xrFrame;
      if (!frame)
        return;
      let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
      if (hitTestResults.length > 0) {
        let pose = hitTestResults[0].getPose(this.engine.xr.currentReferenceSpace);
        this.visible = !!pose;
        if (pose) {
          setXRRigidTransformLocal(this.object, pose.transform);
        }
      } else {
        this.visible = false;
      }
    }
    if (this.visible != wasVisible) {
      (this.visible ? this.onHitFound : this.onHitLost).notify(this);
    }
  }
  getHitTestResults(frame = this.engine.xr?.frame ?? null) {
    if (!frame)
      return [];
    if (!this.xrHitTestSource)
      return [];
    return frame.getHitTestResults(this.xrHitTestSource);
  }
  onXRSessionStart(session) {
    if (session.requestHitTestSource === void 0) {
      console.error("hit-test-location: hit test feature not available. Deactivating component.");
      this.active = false;
      return;
    }
    session.requestHitTestSource({
      space: this.xrReferenceSpace ?? this.engine.xr.referenceSpaceForType("viewer")
    }).then((hitTestSource) => {
      this.xrHitTestSource = hitTestSource;
    }).catch(console.error);
  }
  onXRSessionEnd() {
    if (!this.xrHitTestSource)
      return;
    this.xrHitTestSource.cancel();
    this.xrHitTestSource = null;
  }
};
__publicField(HitTestLocation, "TypeName", "hit-test-location");
__decorate3([
  property.bool(true)
], HitTestLocation.prototype, "scaleObject", void 0);

// node_modules/@wonderlandengine/components/dist/cursor.js
var __decorate4 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var tempVec2 = new Float32Array(3);
var ZERO = [0, 0, 0];
var CursorTargetEmitters = class {
  /** Emitter for events when the target is hovered */
  onHover = new Emitter();
  /** Emitter for events when the target is unhovered */
  onUnhover = new Emitter();
  /** Emitter for events when the target is clicked */
  onClick = new Emitter();
  /** Emitter for events when the cursor moves on the target */
  onMove = new Emitter();
  /** Emitter for events when the user pressed the select button on the target */
  onDown = new Emitter();
  /** Emitter for events when the user unpressed the select button on the target */
  onUp = new Emitter();
};
var Cursor = class extends Component {
  static onRegister(engine2) {
    engine2.registerComponent(HitTestLocation);
  }
  _collisionMask = 0;
  _onDeactivateCallbacks = [];
  _input = null;
  _origin = new Float32Array(3);
  _cursorObjScale = new Float32Array(3);
  _direction = new Float32Array(3);
  _projectionMatrix = new Float32Array(16);
  _viewComponent = null;
  _isDown = false;
  _lastIsDown = false;
  _arTouchDown = false;
  _lastPointerPos = new Float32Array(2);
  _lastCursorPosOnTarget = new Float32Array(3);
  _hitTestLocation = null;
  _hitTestObject = null;
  _onSessionStartCallback = null;
  /**
   * Whether the cursor (and cursorObject) is visible, i.e. pointing at an object
   * that matches the collision group
   */
  visible = true;
  /** Currently hovered object */
  hoveringObject = null;
  /** CursorTarget component of the currently hovered object */
  hoveringObjectTarget = null;
  /** Whether the cursor is hovering reality via hit-test */
  hoveringReality = false;
  /**
   * Global target lets you receive global cursor events on any object.
   */
  globalTarget = new CursorTargetEmitters();
  /**
   * Hit test target lets you receive cursor events for "reality", if
   * `useWebXRHitTest` is set to `true`.
   *
   * @example
   * ```js
   * cursor.hitTestTarget.onClick.add((hit, cursor) => {
   *     // User clicked on reality
   * });
   * ```
   */
  hitTestTarget = new CursorTargetEmitters();
  /** World position of the cursor */
  cursorPos = new Float32Array(3);
  /** Collision group for the ray cast. Only objects in this group will be affected by this cursor. */
  collisionGroup = 1;
  /** (optional) Object that visualizes the cursor's ray. */
  cursorRayObject = null;
  /** Axis along which to scale the `cursorRayObject`. */
  cursorRayScalingAxis = 2;
  /** (optional) Object that visualizes the cursor's hit location. */
  cursorObject = null;
  /** Handedness for VR cursors to accept trigger events only from respective controller. */
  handedness = 0;
  /** Mode for raycasting, whether to use PhysX or simple collision components */
  rayCastMode = 0;
  /** Maximum distance for the cursor's ray cast. */
  maxDistance = 100;
  /** Whether to set the CSS style of the mouse cursor on desktop */
  styleCursor = true;
  /**
   * Use WebXR hit-test if available.
   *
   * Attaches a hit-test-location component to the cursorObject, which will be used
   * by the cursor to send events to the hitTestTarget with HitTestResult.
   */
  useWebXRHitTest = false;
  _onViewportResize = () => {
    if (!this._viewComponent)
      return;
    mat4_exports.invert(this._projectionMatrix, this._viewComponent.projectionMatrix);
  };
  start() {
    this._collisionMask = 1 << this.collisionGroup;
    if (this.handedness == 0) {
      const inputComp = this.object.getComponent("input");
      if (!inputComp) {
        console.warn("cursor component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
      } else {
        this.handedness = inputComp.handedness || "none";
        this._input = inputComp;
      }
    } else {
      this.handedness = ["left", "right", "none"][this.handedness - 1];
    }
    this._viewComponent = this.object.getComponent(ViewComponent);
    if (this.useWebXRHitTest) {
      this._hitTestObject = this.engine.scene.addObject(this.object);
      this._hitTestLocation = this._hitTestObject.addComponent(HitTestLocation, {
        scaleObject: false
      }) ?? null;
    }
    this._onSessionStartCallback = this.setupVREvents.bind(this);
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this._onSessionStartCallback);
    this.engine.onResize.add(this._onViewportResize);
    this._setCursorVisibility(true);
    if (this._viewComponent != null) {
      const canvas2 = this.engine.canvas;
      const onClick = this.onClick.bind(this);
      const onPointerMove = this.onPointerMove.bind(this);
      const onPointerDown = this.onPointerDown.bind(this);
      const onPointerUp = this.onPointerUp.bind(this);
      canvas2.addEventListener("click", onClick);
      canvas2.addEventListener("pointermove", onPointerMove);
      canvas2.addEventListener("pointerdown", onPointerDown);
      canvas2.addEventListener("pointerup", onPointerUp);
      this._onDeactivateCallbacks.push(() => {
        canvas2.removeEventListener("click", onClick);
        canvas2.removeEventListener("pointermove", onPointerMove);
        canvas2.removeEventListener("pointerdown", onPointerDown);
        canvas2.removeEventListener("pointerup", onPointerUp);
      });
    }
    this._onViewportResize();
  }
  _setCursorRayTransform(hitPosition) {
    if (!this.cursorRayObject)
      return;
    const dist2 = vec3_exports.dist(this._origin, hitPosition);
    this.cursorRayObject.setPositionLocal([0, 0, -dist2 / 2]);
    if (this.cursorRayScalingAxis != 4) {
      tempVec2.fill(1);
      tempVec2[this.cursorRayScalingAxis] = dist2 / 2;
      this.cursorRayObject.setScalingLocal(tempVec2);
    }
  }
  _setCursorVisibility(visible) {
    if (this.visible == visible)
      return;
    this.visible = visible;
    if (!this.cursorObject)
      return;
    if (visible) {
      this.cursorObject.setScalingWorld(this._cursorObjScale);
    } else {
      this.cursorObject.getScalingWorld(this._cursorObjScale);
      this.cursorObject.scaleLocal([0, 0, 0]);
    }
  }
  update() {
    if (this.engine.xr && this._arTouchDown && this._input && this.engine.xr.session.inputSources[0].handedness === "none" && this.engine.xr.session.inputSources[0].gamepad) {
      const p = this.engine.xr.session.inputSources[0].gamepad.axes;
      this._direction[0] = p[0];
      this._direction[1] = -p[1];
      this._direction[2] = -1;
      this.applyTransformAndProjectDirection();
    } else if (this.engine.xr && this._input && this._input.xrInputSource) {
      this._direction[0] = 0;
      this._direction[1] = 0;
      this._direction[2] = -1;
      this.applyTransformToDirection();
    } else if (this._viewComponent) {
      this.updateDirection();
    }
    this.rayCast(null, this.engine.xr?.frame);
    if (this.cursorObject) {
      if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
        this._setCursorVisibility(true);
        this.cursorObject.setPositionWorld(this.cursorPos);
        this._setCursorRayTransform(this.cursorPos);
      } else {
        this._setCursorVisibility(false);
      }
    }
  }
  /* Returns the hovered cursor target, if available */
  notify(event, originalEvent) {
    const target = this.hoveringObject;
    if (target) {
      const cursorTarget = this.hoveringObjectTarget;
      if (cursorTarget)
        cursorTarget[event].notify(target, this, originalEvent ?? void 0);
      this.globalTarget[event].notify(target, this, originalEvent ?? void 0);
    }
  }
  hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent) {
    const hit = !this.hoveringReality && rayHit.hitCount > 0 ? rayHit.objects[0] : null;
    if (hit) {
      if (!this.hoveringObject || !this.hoveringObject.equals(hit)) {
        if (this.hoveringObject) {
          this.notify("onUnhover", originalEvent);
        }
        this.hoveringObject = hit;
        this.hoveringObjectTarget = this.hoveringObject.getComponent(CursorTarget);
        if (this.styleCursor)
          this.engine.canvas.style.cursor = "pointer";
        this.notify("onHover", originalEvent);
      }
    } else if (this.hoveringObject) {
      this.notify("onUnhover", originalEvent);
      this.hoveringObject = null;
      this.hoveringObjectTarget = null;
      if (this.styleCursor)
        this.engine.canvas.style.cursor = "default";
    }
    if (this.hoveringObject) {
      if (this._isDown !== this._lastIsDown) {
        this.notify(this._isDown ? "onDown" : "onUp", originalEvent);
      }
      if (doClick)
        this.notify("onClick", originalEvent);
    } else if (this.hoveringReality) {
      if (this._isDown !== this._lastIsDown) {
        (this._isDown ? this.hitTestTarget.onDown : this.hitTestTarget.onUp).notify(hitTestResult, this, originalEvent ?? void 0);
      }
      if (doClick)
        this.hitTestTarget.onClick.notify(hitTestResult, this, originalEvent ?? void 0);
    }
    if (hit) {
      if (this.hoveringObject) {
        this.hoveringObject.transformPointInverseWorld(tempVec2, this.cursorPos);
      } else {
        tempVec2.set(this.cursorPos);
      }
      if (!vec3_exports.equals(this._lastCursorPosOnTarget, tempVec2)) {
        this.notify("onMove", originalEvent);
        this._lastCursorPosOnTarget.set(tempVec2);
      }
    } else if (this.hoveringReality) {
      if (!vec3_exports.equals(this._lastCursorPosOnTarget, this.cursorPos)) {
        this.hitTestTarget.onMove.notify(hitTestResult, this, originalEvent ?? void 0);
        this._lastCursorPosOnTarget.set(this.cursorPos);
      }
    } else {
      this._lastCursorPosOnTarget.set(this.cursorPos);
    }
    this._lastIsDown = this._isDown;
  }
  /**
   * Setup event listeners on session object
   * @param s WebXR session
   *
   * Sets up 'select' and 'end' events.
   */
  setupVREvents(s) {
    if (!s)
      console.error("setupVREvents called without a valid session");
    if (!this.active)
      return;
    const onSelect = this.onSelect.bind(this);
    s.addEventListener("select", onSelect);
    const onSelectStart = this.onSelectStart.bind(this);
    s.addEventListener("selectstart", onSelectStart);
    const onSelectEnd = this.onSelectEnd.bind(this);
    s.addEventListener("selectend", onSelectEnd);
    this._onDeactivateCallbacks.push(() => {
      if (!this.engine.xr)
        return;
      s.removeEventListener("select", onSelect);
      s.removeEventListener("selectstart", onSelectStart);
      s.removeEventListener("selectend", onSelectEnd);
    });
    this._onViewportResize();
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this._onSessionStartCallback);
    this.engine.onResize.remove(this._onViewportResize);
    this._setCursorVisibility(false);
    if (this.hoveringObject)
      this.notify("onUnhover", null);
    if (this.cursorRayObject)
      this.cursorRayObject.setScalingLocal(ZERO);
    for (const f of this._onDeactivateCallbacks)
      f();
    this._onDeactivateCallbacks.length = 0;
  }
  onDestroy() {
    this._hitTestObject?.destroy();
  }
  /** 'select' event listener */
  onSelect(e) {
    if (e.inputSource.handedness != this.handedness)
      return;
    this.rayCast(e, e.frame, true);
  }
  /** 'selectstart' event listener */
  onSelectStart(e) {
    this._arTouchDown = true;
    if (e.inputSource.handedness == this.handedness) {
      this._isDown = true;
      this.rayCast(e, e.frame);
    }
  }
  /** 'selectend' event listener */
  onSelectEnd(e) {
    this._arTouchDown = false;
    if (e.inputSource.handedness == this.handedness) {
      this._isDown = false;
      this.rayCast(e, e.frame);
    }
  }
  /** 'pointermove' event listener */
  onPointerMove(e) {
    if (!e.isPrimary)
      return;
    this.updateMousePos(e);
    this.rayCast(e, null);
  }
  /** 'click' event listener */
  onClick(e) {
    this.updateMousePos(e);
    this.rayCast(e, null, true);
  }
  /** 'pointerdown' event listener */
  onPointerDown(e) {
    if (!e.isPrimary || e.button !== 0)
      return;
    this.updateMousePos(e);
    this._isDown = true;
    this.rayCast(e);
  }
  /** 'pointerup' event listener */
  onPointerUp(e) {
    if (!e.isPrimary || e.button !== 0)
      return;
    this.updateMousePos(e);
    this._isDown = false;
    this.rayCast(e);
  }
  /**
   * Update mouse position in non-VR mode and raycast for new position
   * @returns @ref RayHit for new position.
   */
  updateMousePos(e) {
    this._lastPointerPos[0] = e.clientX;
    this._lastPointerPos[1] = e.clientY;
    this.updateDirection();
  }
  updateDirection() {
    const bounds = this.engine.canvas.getBoundingClientRect();
    const left = this._lastPointerPos[0] / bounds.width;
    const top = this._lastPointerPos[1] / bounds.height;
    this._direction[0] = left * 2 - 1;
    this._direction[1] = -top * 2 + 1;
    this._direction[2] = -1;
    this.applyTransformAndProjectDirection();
  }
  applyTransformAndProjectDirection() {
    vec3_exports.transformMat4(this._direction, this._direction, this._projectionMatrix);
    vec3_exports.normalize(this._direction, this._direction);
    this.applyTransformToDirection();
  }
  applyTransformToDirection() {
    this.object.transformVectorWorld(this._direction, this._direction);
    this.object.getPositionWorld(this._origin);
  }
  rayCast(originalEvent, frame = null, doClick = false) {
    const rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(this._origin, this._direction, this._collisionMask) : this.engine.physics.rayCast(this._origin, this._direction, this._collisionMask, this.maxDistance);
    let hitResultDistance = Infinity;
    let hitTestResult = null;
    if (this._hitTestLocation?.visible) {
      this._hitTestObject.getPositionWorld(this.cursorPos);
      hitResultDistance = vec3_exports.distance(this.object.getPositionWorld(tempVec2), this.cursorPos);
      hitTestResult = this._hitTestLocation?.getHitTestResults(frame)[0];
    }
    let hoveringReality = false;
    if (rayHit.hitCount > 0) {
      const d = rayHit.distances[0];
      if (hitResultDistance >= d) {
        this.cursorPos.set(rayHit.locations[0]);
      } else {
        hoveringReality = true;
      }
    } else if (hitResultDistance < Infinity) {
    } else {
      this.cursorPos.fill(0);
    }
    if (hoveringReality && !this.hoveringReality) {
      this.hitTestTarget.onHover.notify(hitTestResult, this);
    } else if (!hoveringReality && this.hoveringReality) {
      this.hitTestTarget.onUnhover.notify(hitTestResult, this);
    }
    this.hoveringReality = hoveringReality;
    this.hoverBehaviour(rayHit, hitTestResult, doClick, originalEvent);
    return rayHit;
  }
};
__publicField(Cursor, "TypeName", "cursor");
/* Dependencies is deprecated, but we keep it here for compatibility
 * with 1.0.0-rc2 until 1.0.0 is released */
__publicField(Cursor, "Dependencies", [HitTestLocation]);
__decorate4([
  property.int(1)
], Cursor.prototype, "collisionGroup", void 0);
__decorate4([
  property.object()
], Cursor.prototype, "cursorRayObject", void 0);
__decorate4([
  property.enum(["x", "y", "z", "none"], "z")
], Cursor.prototype, "cursorRayScalingAxis", void 0);
__decorate4([
  property.object()
], Cursor.prototype, "cursorObject", void 0);
__decorate4([
  property.enum(["input component", "left", "right", "none"], "input component")
], Cursor.prototype, "handedness", void 0);
__decorate4([
  property.enum(["collision", "physx"], "collision")
], Cursor.prototype, "rayCastMode", void 0);
__decorate4([
  property.float(100)
], Cursor.prototype, "maxDistance", void 0);
__decorate4([
  property.bool(true)
], Cursor.prototype, "styleCursor", void 0);
__decorate4([
  property.bool(false)
], Cursor.prototype, "useWebXRHitTest", void 0);

// node_modules/@wonderlandengine/components/dist/debug-object.js
var __decorate5 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DebugObject = class extends Component {
  /** A second object to print the name of */
  obj = null;
  start() {
    let origin = new Float32Array(3);
    quat2_exports.getTranslation(origin, this.object.transformWorld);
    console.log("Debug object:", this.object.name);
    console.log("Other object:", this.obj?.name);
    console.log("	translation", origin);
    console.log("	transformWorld", this.object.transformWorld);
    console.log("	transformLocal", this.object.transformLocal);
  }
};
__publicField(DebugObject, "TypeName", "debug-object");
__decorate5([
  property.object()
], DebugObject.prototype, "obj", void 0);

// node_modules/@wonderlandengine/components/dist/finger-cursor.js
var FingerCursor = class extends Component {
  init() {
    this.lastTarget = null;
  }
  start() {
    this.tip = this.object.getComponent("collision");
  }
  update() {
    const overlaps = this.tip.queryOverlaps();
    let overlapFound = null;
    for (let i = 0; i < overlaps.length; ++i) {
      const o = overlaps[i].object;
      const target = o.getComponent("cursor-target");
      if (target) {
        if (!target.equals(this.lastTarget)) {
          target.onHover(o, this);
          target.onClick(o, this);
        }
        overlapFound = target;
        break;
      }
    }
    if (!overlapFound) {
      if (this.lastTarget)
        this.lastTarget.onUnhover(this.lastTarget.object, this);
      this.lastTarget = null;
      return;
    } else {
      this.lastTarget = overlapFound;
    }
  }
};
__publicField(FingerCursor, "TypeName", "finger-cursor");
__publicField(FingerCursor, "Properties", {});

// node_modules/@wonderlandengine/components/dist/fixed-foveation.js
var FixedFoveation = class extends Component {
  start() {
    this.onSessionStartCallback = this.setFixedFoveation.bind(this);
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
  }
  setFixedFoveation() {
    this.engine.xr.baseLayer.fixedFoveation = this.fixedFoveation;
  }
};
__publicField(FixedFoveation, "TypeName", "fixed-foveation");
__publicField(FixedFoveation, "Properties", {
  /** Amount to apply from 0 (none) to 1 (full) */
  fixedFoveation: { type: Type.Float, default: 0.5 }
});

// node_modules/@wonderlandengine/components/dist/hand-tracking.js
var __decorate6 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ORDERED_JOINTS = [
  "wrist",
  "thumb-metacarpal",
  "thumb-phalanx-proximal",
  "thumb-phalanx-distal",
  "thumb-tip",
  "index-finger-metacarpal",
  "index-finger-phalanx-proximal",
  "index-finger-phalanx-intermediate",
  "index-finger-phalanx-distal",
  "index-finger-tip",
  "middle-finger-metacarpal",
  "middle-finger-phalanx-proximal",
  "middle-finger-phalanx-intermediate",
  "middle-finger-phalanx-distal",
  "middle-finger-tip",
  "ring-finger-metacarpal",
  "ring-finger-phalanx-proximal",
  "ring-finger-phalanx-intermediate",
  "ring-finger-phalanx-distal",
  "ring-finger-tip",
  "pinky-finger-metacarpal",
  "pinky-finger-phalanx-proximal",
  "pinky-finger-phalanx-intermediate",
  "pinky-finger-phalanx-distal",
  "pinky-finger-tip"
];
var invTranslation = vec3_exports.create();
var invRotation = quat_exports.create();
var tempVec0 = vec3_exports.create();
var tempVec1 = vec3_exports.create();
var HandTracking = class extends Component {
  /** Handedness determining whether to receive tracking input from right or left hand */
  handedness = 0;
  /** (optional) Mesh to use to visualize joints */
  jointMesh = null;
  /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
  jointMaterial = null;
  /** (optional) Skin to apply tracked joint poses to. If not present,
   * joint spheres will be used for display instead. */
  handSkin = null;
  /** Deactivate children if no pose was tracked */
  deactivateChildrenWithoutPose = true;
  /** Controller objects to activate including children if no pose is available */
  controllerToDeactivate = null;
  init() {
    this.handedness = ["left", "right"][this.handedness];
  }
  joints = {};
  session = null;
  /* Whether last update had a hand pose */
  hasPose = false;
  _childrenActive = true;
  start() {
    if (!("XRHand" in window)) {
      console.warn("WebXR Hand Tracking not supported by this browser.");
      this.active = false;
      return;
    }
    if (this.handSkin) {
      const skin = this.handSkin;
      const jointIds = skin.jointIds;
      this.joints[ORDERED_JOINTS[0]] = this.engine.wrapObject(jointIds[0]);
      for (let j = 0; j < jointIds.length; ++j) {
        const joint = this.engine.wrapObject(jointIds[j]);
        this.joints[joint.name] = joint;
      }
      return;
    }
    const jointObjects = this.engine.scene.addObjects(ORDERED_JOINTS.length, this.object, ORDERED_JOINTS.length);
    for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
      const joint = jointObjects[j];
      joint.addComponent(MeshComponent, {
        mesh: this.jointMesh,
        material: this.jointMaterial
      });
      this.joints[ORDERED_JOINTS[j]] = joint;
      joint.name = ORDERED_JOINTS[j];
    }
  }
  update(dt) {
    if (!this.engine.xr)
      return;
    this.hasPose = false;
    if (this.engine.xr.session.inputSources) {
      for (let i = 0; i < this.engine.xr.session.inputSources.length; ++i) {
        const inputSource = this.engine.xr.session.inputSources[i];
        if (!inputSource?.hand || inputSource?.handedness != this.handedness)
          continue;
        const wristSpace = inputSource.hand.get("wrist");
        if (wristSpace) {
          const p = this.engine.xr.frame.getJointPose(wristSpace, this.engine.xr.currentReferenceSpace);
          if (p) {
            setXRRigidTransformLocal(this.object, p.transform);
          }
        }
        this.object.getRotationLocal(invRotation);
        quat_exports.conjugate(invRotation, invRotation);
        this.object.getPositionLocal(invTranslation);
        this.joints["wrist"].resetTransform();
        for (let j = 0; j < ORDERED_JOINTS.length; ++j) {
          const jointName = ORDERED_JOINTS[j];
          const joint = this.joints[jointName];
          if (!joint)
            continue;
          let jointPose = null;
          const jointSpace = inputSource.hand.get(jointName);
          if (jointSpace) {
            jointPose = this.engine.xr.frame.getJointPose(jointSpace, this.engine.xr.currentReferenceSpace);
          }
          if (jointPose) {
            this.hasPose = true;
            joint.resetPositionRotation();
            joint.translateLocal([
              jointPose.transform.position.x - invTranslation[0],
              jointPose.transform.position.y - invTranslation[1],
              jointPose.transform.position.z - invTranslation[2]
            ]);
            joint.rotateLocal(invRotation);
            joint.rotateObject([
              jointPose.transform.orientation.x,
              jointPose.transform.orientation.y,
              jointPose.transform.orientation.z,
              jointPose.transform.orientation.w
            ]);
            if (!this.handSkin) {
              const r = jointPose.radius || 7e-3;
              joint.setScalingLocal([r, r, r]);
            }
          }
        }
      }
    }
    if (!this.hasPose && this._childrenActive) {
      this._childrenActive = false;
      if (this.deactivateChildrenWithoutPose) {
        this.setChildrenActive(false);
      }
      if (this.controllerToDeactivate) {
        this.controllerToDeactivate.active = true;
        this.setChildrenActive(true, this.controllerToDeactivate);
      }
    } else if (this.hasPose && !this._childrenActive) {
      this._childrenActive = true;
      if (this.deactivateChildrenWithoutPose) {
        this.setChildrenActive(true);
      }
      if (this.controllerToDeactivate) {
        this.controllerToDeactivate.active = false;
        this.setChildrenActive(false, this.controllerToDeactivate);
      }
    }
  }
  setChildrenActive(active, object) {
    object = object || this.object;
    const children = object.children;
    for (const o of children) {
      o.active = active;
      this.setChildrenActive(active, o);
    }
  }
  isGrabbing() {
    this.joints["index-finger-tip"].getPositionLocal(tempVec0);
    this.joints["thumb-tip"].getPositionLocal(tempVec1);
    return vec3_exports.sqrDist(tempVec0, tempVec1) < 1e-3;
  }
};
__publicField(HandTracking, "TypeName", "hand-tracking");
__decorate6([
  property.enum(["left", "right"])
], HandTracking.prototype, "handedness", void 0);
__decorate6([
  property.mesh()
], HandTracking.prototype, "jointMesh", void 0);
__decorate6([
  property.material()
], HandTracking.prototype, "jointMaterial", void 0);
__decorate6([
  property.skin()
], HandTracking.prototype, "handSkin", void 0);
__decorate6([
  property.bool(true)
], HandTracking.prototype, "deactivateChildrenWithoutPose", void 0);
__decorate6([
  property.object()
], HandTracking.prototype, "controllerToDeactivate", void 0);

// node_modules/@wonderlandengine/components/dist/howler-audio-listener.js
var import_howler = __toESM(require_howler(), 1);
var HowlerAudioListener = class extends Component {
  init() {
    this.origin = new Float32Array(3);
    this.fwd = new Float32Array(3);
    this.up = new Float32Array(3);
  }
  update() {
    if (!this.spatial)
      return;
    this.object.getTranslationWorld(this.origin);
    this.object.getForward(this.fwd);
    this.object.getUp(this.up);
    Howler.pos(this.origin[0], this.origin[1], this.origin[2]);
    Howler.orientation(this.fwd[0], this.fwd[1], this.fwd[2], this.up[0], this.up[1], this.up[2]);
  }
};
__publicField(HowlerAudioListener, "TypeName", "howler-audio-listener");
__publicField(HowlerAudioListener, "Properties", {
  /** Whether audio should be spatialized/positional. */
  spatial: { type: Type.Bool, default: true }
});

// node_modules/@wonderlandengine/components/dist/howler-audio-source.js
var import_howler2 = __toESM(require_howler(), 1);
var HowlerAudioSource = class extends Component {
  start() {
    this.audio = new Howl({
      src: [this.src],
      loop: this.loop,
      volume: this.volume,
      autoplay: this.autoplay
    });
    this.lastPlayedAudioId = null;
    this.origin = new Float32Array(3);
    this.lastOrigin = new Float32Array(3);
    if (this.spatial && this.autoplay) {
      this.updatePosition();
      this.play();
    }
  }
  update() {
    if (!this.spatial || !this.lastPlayedAudioId)
      return;
    this.object.getTranslationWorld(this.origin);
    if (Math.abs(this.lastOrigin[0] - this.origin[0]) > 5e-3 || Math.abs(this.lastOrigin[1] - this.origin[1]) > 5e-3 || Math.abs(this.lastOrigin[2] - this.origin[2]) > 5e-3) {
      this.updatePosition();
    }
  }
  updatePosition() {
    this.audio.pos(this.origin[0], this.origin[1], this.origin[2], this.lastPlayedAudioId);
    this.lastOrigin.set(this.origin);
  }
  play() {
    if (this.lastPlayedAudioId)
      this.audio.stop(this.lastPlayedAudioId);
    this.lastPlayedAudioId = this.audio.play();
    if (this.spatial)
      this.updatePosition();
  }
  stop() {
    if (!this.lastPlayedAudioId)
      return;
    this.audio.stop(this.lastPlayedAudioId);
    this.lastPlayedAudioId = null;
  }
  onDeactivate() {
    this.stop();
  }
};
__publicField(HowlerAudioSource, "TypeName", "howler-audio-source");
__publicField(HowlerAudioSource, "Properties", {
  /** Volume */
  volume: { type: Type.Float, default: 1 },
  /** Whether audio should be spatialized/positional */
  spatial: { type: Type.Bool, default: true },
  /** Whether to loop the sound */
  loop: { type: Type.Bool, default: false },
  /** Whether to start playing automatically */
  autoplay: { type: Type.Bool, default: false },
  /** URL to a sound file to play */
  src: { type: Type.String, default: "" }
});

// node_modules/@wonderlandengine/components/dist/utils/utils.js
function setFirstMaterialTexture(mat, texture, customTextureProperty) {
  if (customTextureProperty !== "auto") {
    mat[customTextureProperty] = texture;
    return true;
  }
  const shader = mat.shader;
  if (shader === "Flat Opaque Textured") {
    mat.flatTexture = texture;
    return true;
  } else if (shader === "Phong Opaque Textured" || shader === "Foliage" || shader === "Phong Normalmapped" || shader === "Phong Lightmapped") {
    mat.diffuseTexture = texture;
    return true;
  } else if (shader === "Particle") {
    mat.mainTexture = texture;
    return true;
  } else if (shader === "DistanceFieldVector") {
    mat.vectorTexture = texture;
    return true;
  } else if (shader === "Background" || shader === "Sky") {
    mat.texture = texture;
    return true;
  } else if (shader === "Physical Opaque Textured") {
    mat.albedoTexture = texture;
    return true;
  }
  return false;
}
function deg2rad(value) {
  return value * Math.PI / 180;
}
function rad2deg(value) {
  return value * 180 / Math.PI;
}

// node_modules/@wonderlandengine/components/dist/image-texture.js
var ImageTexture = class extends Component {
  start() {
    if (!this.material) {
      throw Error("image-texture: material property not set");
    }
    this.engine.textures.load(this.url, "anonymous").then((texture) => {
      const mat = this.material;
      if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
        console.error("Shader", mat.shader, "not supported by image-texture");
      }
    }).catch(console.err);
  }
};
__publicField(ImageTexture, "TypeName", "image-texture");
__publicField(ImageTexture, "Properties", {
  /** URL to download the image from */
  url: Property.string(),
  /** Material to apply the video texture to */
  material: Property.material(),
  /** Name of the texture property to set */
  textureProperty: Property.string("auto")
});

// node_modules/@wonderlandengine/components/dist/mouse-look.js
var __decorate7 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var preventDefault = (e) => {
  e.preventDefault();
};
var MouseLookComponent = class extends Component {
  /** Mouse look sensitivity */
  sensitity = 0.25;
  /** Require a mouse button to be pressed to control view.
   * Otherwise view will allways follow mouse movement */
  requireMouseDown = true;
  /** If "moveOnClick" is enabled, mouse button which should
   * be held down to control view */
  mouseButtonIndex = 0;
  /** Enables pointer lock on "mousedown" event on canvas */
  pointerLockOnClick = false;
  currentRotationY = 0;
  currentRotationX = 0;
  origin = new Float32Array(3);
  parentOrigin = new Float32Array(3);
  rotationX = 0;
  rotationY = 0;
  mouseDown = false;
  onActivate() {
    document.addEventListener("mousemove", this.onMouseMove);
    const canvas2 = this.engine.canvas;
    if (this.pointerLockOnClick) {
      canvas2.addEventListener("mousedown", this.requestPointerLock);
    }
    if (this.requireMouseDown) {
      if (this.mouseButtonIndex === 2) {
        canvas2.addEventListener("contextmenu", preventDefault, false);
      }
      canvas2.addEventListener("mousedown", this.onMouseDown);
      canvas2.addEventListener("mouseup", this.onMouseUp);
    }
  }
  onDeactivate() {
    document.removeEventListener("mousemove", this.onMouseMove);
    const canvas2 = this.engine.canvas;
    if (this.pointerLockOnClick) {
      canvas2.removeEventListener("mousedown", this.requestPointerLock);
    }
    if (this.requireMouseDown) {
      if (this.mouseButtonIndex === 2) {
        canvas2.removeEventListener("contextmenu", preventDefault, false);
      }
      canvas2.removeEventListener("mousedown", this.onMouseDown);
      canvas2.removeEventListener("mouseup", this.onMouseUp);
    }
  }
  requestPointerLock = () => {
    const canvas2 = this.engine.canvas;
    canvas2.requestPointerLock = canvas2.requestPointerLock || canvas2.mozRequestPointerLock || canvas2.webkitRequestPointerLock;
    canvas2.requestPointerLock();
  };
  onMouseDown = (e) => {
    if (e.button === this.mouseButtonIndex) {
      this.mouseDown = true;
      document.body.style.cursor = "grabbing";
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    }
  };
  onMouseUp = (e) => {
    if (e.button === this.mouseButtonIndex) {
      this.mouseDown = false;
      document.body.style.cursor = "initial";
    }
  };
  onMouseMove = (e) => {
    if (this.active && (this.mouseDown || !this.requireMouseDown)) {
      this.rotationY = -this.sensitity * e.movementX / 100;
      this.rotationX = -this.sensitity * e.movementY / 100;
      this.currentRotationX += this.rotationX;
      this.currentRotationY += this.rotationY;
      this.currentRotationX = Math.min(1.507, this.currentRotationX);
      this.currentRotationX = Math.max(-1.507, this.currentRotationX);
      this.object.getPositionWorld(this.origin);
      const parent = this.object.parent;
      if (parent) {
        parent.getPositionWorld(this.parentOrigin);
        vec3_exports.sub(this.origin, this.origin, this.parentOrigin);
      }
      this.object.resetPositionRotation();
      this.object.rotateAxisAngleRadLocal([1, 0, 0], this.currentRotationX);
      this.object.rotateAxisAngleRadLocal([0, 1, 0], this.currentRotationY);
      this.object.translateLocal(this.origin);
    }
  };
};
__publicField(MouseLookComponent, "TypeName", "mouse-look");
__decorate7([
  property.float(0.25)
], MouseLookComponent.prototype, "sensitity", void 0);
__decorate7([
  property.bool(true)
], MouseLookComponent.prototype, "requireMouseDown", void 0);
__decorate7([
  property.int()
], MouseLookComponent.prototype, "mouseButtonIndex", void 0);
__decorate7([
  property.bool(false)
], MouseLookComponent.prototype, "pointerLockOnClick", void 0);

// node_modules/@wonderlandengine/components/dist/player-height.js
var __decorate8 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PlayerHeight = class extends Component {
  height = 1.75;
  onSessionStartCallback;
  onSessionEndCallback;
  start() {
    this.object.resetPositionRotation();
    this.object.translateLocal([0, this.height, 0]);
    this.onSessionStartCallback = this.onXRSessionStart.bind(this);
    this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
  }
  onXRSessionStart() {
    const type = this.engine.xr?.currentReferenceSpaceType;
    if (type !== "local" && type !== "viewer") {
      this.object.resetPositionRotation();
    }
  }
  onXRSessionEnd() {
    const type = this.engine.xr?.currentReferenceSpaceType;
    if (type !== "local" && type !== "viewer") {
      this.object.resetPositionRotation();
      this.object.translateLocal([0, this.height, 0]);
    }
  }
};
__publicField(PlayerHeight, "TypeName", "player-height");
__decorate8([
  property.float(1.75)
], PlayerHeight.prototype, "height", void 0);

// node_modules/@wonderlandengine/components/dist/target-framerate.js
var TargetFramerate = class extends Component {
  start() {
    this.onSessionStartCallback = this.setTargetFramerate.bind(this);
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
  }
  setTargetFramerate(s) {
    if (s.supportedFrameRates && s.updateTargetFrameRate) {
      const a = this.engine.xr.session.supportedFrameRates;
      a.sort((a2, b) => Math.abs(a2 - this.framerate) - Math.abs(b - this.framerate));
      this.engine.xr.session.updateTargetFrameRate(a[0]);
    }
  }
};
__publicField(TargetFramerate, "TypeName", "target-framerate");
__publicField(TargetFramerate, "Properties", {
  framerate: { type: Type.Float, default: 90 }
});

// node_modules/@wonderlandengine/components/dist/teleport.js
var TeleportComponent = class extends Component {
  init() {
    this._prevThumbstickAxis = new Float32Array(2);
    this._tempVec = new Float32Array(3);
    this._tempVec0 = new Float32Array(3);
    this._currentIndicatorRotation = 0;
    this.input = this.object.getComponent("input");
    if (!this.input) {
      console.error(this.object.name, "generic-teleport-component.js: input component is required on the object");
      return;
    }
    if (!this.teleportIndicatorMeshObject) {
      console.error(this.object.name, "generic-teleport-component.js: Teleport indicator mesh is missing");
      return;
    }
    if (!this.camRoot) {
      console.error(this.object.name, "generic-teleport-component.js: camRoot not set");
      return;
    }
    this.isIndicating = false;
    this.indicatorHidden = true;
    this.hitSpot = new Float32Array(3);
    this._hasHit = false;
    this._extraRotation = 0;
    this._currentStickAxes = new Float32Array(2);
  }
  start() {
    if (this.cam) {
      this.isMouseIndicating = false;
      canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    }
    if (this.handedness == 0) {
      const inputComp = this.object.getComponent("input");
      if (!inputComp) {
        console.warn("teleport component on object", this.object.name, 'was configured with handedness "input component", but object has no input component.');
      } else {
        this.handedness = inputComp.handedness;
        this.input = inputComp;
      }
    } else {
      this.handedness = ["left", "right"][this.handedness - 1];
    }
    this.onSessionStartCallback = this.setupVREvents.bind(this);
    this.teleportIndicatorMeshObject.active = false;
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
  }
  /* Get current camera Y rotation */
  _getCamRotation() {
    this.eyeLeft.getForward(this._tempVec);
    this._tempVec[1] = 0;
    vec3_exports.normalize(this._tempVec, this._tempVec);
    return Math.atan2(this._tempVec[0], this._tempVec[2]);
  }
  update() {
    let inputLength = 0;
    if (this.gamepad && this.gamepad.axes) {
      this._currentStickAxes[0] = this.gamepad.axes[2];
      this._currentStickAxes[1] = this.gamepad.axes[3];
      inputLength = Math.abs(this._currentStickAxes[0]) + Math.abs(this._currentStickAxes[1]);
    }
    if (!this.isIndicating && this._prevThumbstickAxis[1] >= this.thumbstickActivationThreshhold && this._currentStickAxes[1] < this.thumbstickActivationThreshhold) {
      this.isIndicating = true;
    } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
      this.isIndicating = false;
      this.teleportIndicatorMeshObject.active = false;
      if (this._hasHit) {
        this._teleportPlayer(this.hitSpot, this._extraRotation);
      }
    }
    if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
      const origin = this._tempVec0;
      this.object.getPositionWorld(origin);
      const direction2 = this.object.getForwardWorld(this._tempVec);
      let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
      if (rayHit.hitCount > 0) {
        this.indicatorHidden = false;
        this._extraRotation = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]);
        this._currentIndicatorRotation = this._getCamRotation() + (this._extraRotation - Math.PI);
        this.teleportIndicatorMeshObject.resetPositionRotation();
        this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
        this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
        this.teleportIndicatorMeshObject.translate([
          0,
          this.indicatorYOffset,
          0
        ]);
        this.teleportIndicatorMeshObject.active = true;
        this.hitSpot.set(rayHit.locations[0]);
        this._hasHit = true;
      } else {
        if (!this.indicatorHidden) {
          this.teleportIndicatorMeshObject.active = false;
          this.indicatorHidden = true;
        }
        this._hasHit = false;
      }
    } else if (this.teleportIndicatorMeshObject && this.isMouseIndicating) {
      this.onMousePressed();
    }
    this._prevThumbstickAxis.set(this._currentStickAxes);
  }
  setupVREvents(s) {
    this.session = s;
    s.addEventListener("end", function() {
      this.gamepad = null;
      this.session = null;
    }.bind(this));
    if (s.inputSources && s.inputSources.length) {
      for (let i = 0; i < s.inputSources.length; i++) {
        let inputSource = s.inputSources[i];
        if (inputSource.handedness == this.handedness) {
          this.gamepad = inputSource.gamepad;
        }
      }
    }
    s.addEventListener("inputsourceschange", function(e) {
      if (e.added && e.added.length) {
        for (let i = 0; i < e.added.length; i++) {
          let inputSource = e.added[i];
          if (inputSource.handedness == this.handedness) {
            this.gamepad = inputSource.gamepad;
          }
        }
      }
    }.bind(this));
  }
  onMouseDown() {
    this.isMouseIndicating = true;
  }
  onMouseUp() {
    this.isMouseIndicating = false;
    this.teleportIndicatorMeshObject.active = false;
    if (this._hasHit) {
      this._teleportPlayer(this.hitSpot, 0);
    }
  }
  onMousePressed() {
    let origin = [0, 0, 0];
    this.cam.getPositionWorld(origin);
    const direction2 = this.cam.getForward(this._tempVec);
    let rayHit = this.rayHit = this.rayCastMode == 0 ? this.engine.scene.rayCast(origin, direction2, 1 << this.floorGroup) : this.engine.physics.rayCast(origin, direction2, 1 << this.floorGroup, this.maxDistance);
    if (rayHit.hitCount > 0) {
      this.indicatorHidden = false;
      direction2[1] = 0;
      vec3_exports.normalize(direction2, direction2);
      this._currentIndicatorRotation = -Math.sign(direction2[2]) * Math.acos(direction2[0]) - Math.PI * 0.5;
      this.teleportIndicatorMeshObject.resetPositionRotation();
      this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
      this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
      this.teleportIndicatorMeshObject.active = true;
      this.hitSpot = rayHit.locations[0];
      this._hasHit = true;
    } else {
      if (!this.indicatorHidden) {
        this.teleportIndicatorMeshObject.active = false;
        this.indicatorHidden = true;
      }
      this._hasHit = false;
    }
  }
  _teleportPlayer(newPosition, rotationToAdd) {
    this.camRoot.rotateAxisAngleRad([0, 1, 0], rotationToAdd);
    const p = this._tempVec;
    const p1 = this._tempVec0;
    if (this.session) {
      this.eyeLeft.getPositionWorld(p);
      this.eyeRight.getPositionWorld(p1);
      vec3_exports.add(p, p, p1);
      vec3_exports.scale(p, p, 0.5);
    } else {
      this.cam.getPositionWorld(p);
    }
    this.camRoot.getPositionWorld(p1);
    vec3_exports.sub(p, p1, p);
    p[0] += newPosition[0];
    p[1] = newPosition[1];
    p[2] += newPosition[2];
    this.camRoot.setPositionWorld(p);
  }
};
__publicField(TeleportComponent, "TypeName", "teleport");
__publicField(TeleportComponent, "Properties", {
  /** Object that will be placed as indiciation forwhere the player will teleport to. */
  teleportIndicatorMeshObject: { type: Type.Object },
  /** Root of the player, the object that will be positioned on teleportation. */
  camRoot: { type: Type.Object },
  /** Non-vr camera for use outside of VR */
  cam: { type: Type.Object },
  /** Left eye for use in VR*/
  eyeLeft: { type: Type.Object },
  /** Right eye for use in VR*/
  eyeRight: { type: Type.Object },
  /** Handedness for VR cursors to accept trigger events only from respective controller. */
  handedness: {
    type: Type.Enum,
    values: ["input component", "left", "right", "none"],
    default: "input component"
  },
  /** Collision group of valid "floor" objects that can be teleported on */
  floorGroup: { type: Type.Int, default: 1 },
  /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
  thumbstickActivationThreshhold: { type: Type.Float, default: -0.7 },
  /** How far the thumbstick needs to be released to execute the teleport */
  thumbstickDeactivationThreshhold: { type: Type.Float, default: 0.3 },
  /** Offset to apply to the indicator object, e.g. to avoid it from Z-fighting with the floor */
  indicatorYOffset: { type: Type.Float, default: 0.01 },
  /** Mode for raycasting, whether to use PhysX or simple collision components */
  rayCastMode: {
    type: Type.Enum,
    values: ["collision", "physx"],
    default: "collision"
  },
  /** Max distance for PhysX raycast */
  maxDistance: { type: Type.Float, default: 100 }
});

// node_modules/@wonderlandengine/components/dist/trail.js
var __decorate9 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var direction = vec3_exports.create();
var offset = vec3_exports.create();
var normal = vec3_exports.create();
var UP = vec3_exports.fromValues(0, 1, 0);
var Trail = class extends Component {
  /** The material to apply to the trail mesh */
  material = null;
  /** The number of segments in the trail mesh */
  segments = 50;
  /** The time interval before recording a new point */
  interval = 0.1;
  /** The width of the trail (in world space) */
  width = 1;
  /** Whether or not the trail should taper off */
  taper = true;
  /**
   * The maximum delta time in seconds, above which the trail resets.
   * This prevents the trail from jumping around when updates happen
   * infrequently (e.g. when the tab doesn't have focus).
   */
  resetThreshold = 0.5;
  _currentPointIndex = 0;
  _timeTillNext = 0;
  _points = [];
  _trailContainer = null;
  _meshComp = null;
  _mesh = null;
  _indexData = null;
  start() {
    this._points = new Array(this.segments + 1);
    for (let i = 0; i < this._points.length; ++i) {
      this._points[i] = vec3_exports.create();
    }
    this._timeTillNext = this.interval;
    this._trailContainer = this.engine.scene.addObject();
    this._meshComp = this._trailContainer.addComponent("mesh");
    this._meshComp.material = this.material;
    const vertexCount = 2 * this._points.length;
    this._indexData = new Uint32Array(6 * this.segments);
    for (let i = 0, v = 0; i < vertexCount - 2; i += 2, v += 6) {
      this._indexData.subarray(v, v + 6).set([i + 1, i + 0, i + 2, i + 2, i + 3, i + 1]);
    }
    this._mesh = new Mesh(this.engine, {
      vertexCount,
      indexData: this._indexData,
      indexType: MeshIndexType.UnsignedInt
    });
    this._meshComp.mesh = this._mesh;
  }
  updateVertices() {
    if (!this._mesh)
      return;
    const positions = this._mesh.attribute(MeshAttribute.Position);
    const texCoords = this._mesh.attribute(MeshAttribute.TextureCoordinate);
    const normals = this._mesh.attribute(MeshAttribute.Normal);
    vec3_exports.set(direction, 0, 0, 0);
    for (let i = 0; i < this._points.length; ++i) {
      const curr = this._points[(this._currentPointIndex + i + 1) % this._points.length];
      const next = this._points[(this._currentPointIndex + i + 2) % this._points.length];
      if (i !== this._points.length - 1) {
        vec3_exports.sub(direction, next, curr);
      }
      vec3_exports.cross(offset, UP, direction);
      vec3_exports.normalize(offset, offset);
      const timeFraction = 1 - this._timeTillNext / this.interval;
      const fraction = (i - timeFraction) / this.segments;
      vec3_exports.scale(offset, offset, (this.taper ? fraction : 1) * this.width / 2);
      positions.set(i * 2, [
        curr[0] - offset[0],
        curr[1] - offset[1],
        curr[2] - offset[2]
      ]);
      positions.set(i * 2 + 1, [
        curr[0] + offset[0],
        curr[1] + offset[1],
        curr[2] + offset[2]
      ]);
      if (normals) {
        vec3_exports.cross(normal, direction, offset);
        vec3_exports.normalize(normal, normal);
        normals.set(i * 2, normal);
        normals.set(i * 2 + 1, normal);
      }
      if (texCoords) {
        texCoords.set(i * 2, [0, fraction]);
        texCoords.set(i * 2 + 1, [1, fraction]);
      }
    }
    this._mesh.update();
  }
  resetTrail() {
    this.object.getPositionWorld(this._points[0]);
    for (let i = 1; i < this._points.length; ++i) {
      vec3_exports.copy(this._points[i], this._points[0]);
    }
    this._currentPointIndex = 0;
    this._timeTillNext = this.interval;
  }
  update(dt) {
    this._timeTillNext -= dt;
    if (dt > this.resetThreshold) {
      this.resetTrail();
    }
    if (this._timeTillNext < 0) {
      this._currentPointIndex = (this._currentPointIndex + 1) % this._points.length;
      this._timeTillNext = this._timeTillNext % this.interval + this.interval;
    }
    this.object.getPositionWorld(this._points[this._currentPointIndex]);
    this.updateVertices();
  }
  onActivate() {
    this.resetTrail();
    if (this._meshComp)
      this._meshComp.active = true;
  }
  onDeactivate() {
    if (this._meshComp)
      this._meshComp.active = false;
  }
  onDestroy() {
    if (this._trailContainer)
      this._trailContainer.destroy();
    if (this._meshComp)
      this._meshComp.destroy();
    if (this._mesh)
      this._mesh.destroy();
  }
};
__publicField(Trail, "TypeName", "trail");
__decorate9([
  property.material()
], Trail.prototype, "material", void 0);
__decorate9([
  property.int(50)
], Trail.prototype, "segments", void 0);
__decorate9([
  property.float(50)
], Trail.prototype, "interval", void 0);
__decorate9([
  property.float(1)
], Trail.prototype, "width", void 0);
__decorate9([
  property.bool(true)
], Trail.prototype, "taper", void 0);
__decorate9([
  property.float(1)
], Trail.prototype, "resetThreshold", void 0);

// node_modules/@wonderlandengine/components/dist/two-joint-ik-solver.js
function clamp2(v, a, b) {
  return Math.max(a, Math.min(v, b));
}
var rootScaling = new Float32Array(3);
var tempQuat3 = new Float32Array(4);
var middlePos = new Float32Array(3);
var endPos = new Float32Array(3);
var targetPos = new Float32Array(3);
var helperPos = new Float32Array(3);
var rootTransform = new Float32Array(8);
var middleTransform = new Float32Array(8);
var endTransform = new Float32Array(8);
var twoJointIK = function() {
  const ta = new Float32Array(3);
  const ca = new Float32Array(3);
  const ba = new Float32Array(3);
  const ab = new Float32Array(3);
  const cb = new Float32Array(3);
  const axis0 = new Float32Array(3);
  const axis1 = new Float32Array(3);
  const temp = new Float32Array(3);
  return function(root, middle, b, c, targetPos2, eps, helper) {
    ba.set(b);
    const lab = vec3_exports.length(ba);
    vec3_exports.sub(ta, b, c);
    const lcb = vec3_exports.length(ta);
    ta.set(targetPos2);
    const lat = clamp2(vec3_exports.length(ta), eps, lab + lcb - eps);
    ca.set(c);
    vec3_exports.scale(ab, b, -1);
    vec3_exports.sub(cb, c, b);
    vec3_exports.normalize(ca, ca);
    vec3_exports.normalize(ba, ba);
    vec3_exports.normalize(ab, ab);
    vec3_exports.normalize(cb, cb);
    vec3_exports.normalize(ta, ta);
    const ac_ab_0 = Math.acos(clamp2(vec3_exports.dot(ca, ba), -1, 1));
    const ba_bc_0 = Math.acos(clamp2(vec3_exports.dot(ab, cb), -1, 1));
    const ac_at_0 = Math.acos(clamp2(vec3_exports.dot(ca, ta), -1, 1));
    const ac_ab_1 = Math.acos(clamp2((lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat), -1, 1));
    const ba_bc_1 = Math.acos(clamp2((lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb), -1, 1));
    if (helper) {
      vec3_exports.sub(ba, helper, b);
      vec3_exports.normalize(ba, ba);
    }
    vec3_exports.cross(axis0, ca, ba);
    vec3_exports.normalize(axis0, axis0);
    vec3_exports.cross(axis1, c, targetPos2);
    vec3_exports.normalize(axis1, axis1);
    middle.transformVectorInverseLocal(temp, axis0);
    root.rotateAxisAngleRadObject(axis1, ac_at_0);
    root.rotateAxisAngleRadObject(axis0, ac_ab_1 - ac_ab_0);
    middle.rotateAxisAngleRadObject(axis0, ba_bc_1 - ba_bc_0);
  };
}();
var TwoJointIkSolver = class extends Component {
  time = 0;
  start() {
    this.root.getTransformLocal(rootTransform);
    this.middle.getTransformLocal(middleTransform);
    this.end.getTransformLocal(endTransform);
  }
  update(dt) {
    this.time += dt;
    this.root.setTransformLocal(rootTransform);
    this.middle.setTransformLocal(middleTransform);
    this.end.setTransformLocal(endTransform);
    this.root.getScalingWorld(rootScaling);
    this.middle.getPositionLocal(middlePos);
    this.end.getPositionLocal(endPos);
    this.middle.transformPointLocal(endPos, endPos);
    if (this.helper) {
      this.helper.getPositionWorld(helperPos);
      this.root.transformPointInverseWorld(helperPos, helperPos);
      vec3_exports.div(helperPos, helperPos, rootScaling);
    }
    this.target.getPositionWorld(targetPos);
    this.root.transformPointInverseWorld(targetPos, targetPos);
    vec3_exports.div(targetPos, targetPos, rootScaling);
    twoJointIK(this.root, this.middle, middlePos, endPos, targetPos, 0.01, this.helper ? helperPos : null, this.time);
    if (this.copyTargetRotation) {
      this.end.setRotationWorld(this.target.getRotationWorld(tempQuat3));
    }
  }
};
__publicField(TwoJointIkSolver, "TypeName", "two-joint-ik-solver");
__publicField(TwoJointIkSolver, "Properties", {
  /** Root bone, never moves */
  root: Property.object(),
  /** Bone attached to the root */
  middle: Property.object(),
  /** Bone attached to the middle */
  end: Property.object(),
  /** Target the joins should reach for */
  target: Property.object(),
  /** Flag for copying rotation from target to end */
  copyTargetRotation: Property.bool(true),
  /** Helper object to use to determine joint rotation axis */
  helper: Property.object()
});

// node_modules/@wonderlandengine/components/dist/video-texture.js
var VideoTexture = class extends Component {
  init() {
    if (!this.material) {
      throw Error("video-texture: material property not set");
    }
    this.loaded = false;
    this.frameUpdateRequested = true;
  }
  start() {
    this.video = document.createElement("video");
    this.video.src = this.url;
    this.video.crossOrigin = "anonymous";
    this.video.playsInline = true;
    this.video.loop = this.loop;
    this.video.muted = this.muted;
    this.video.addEventListener("playing", () => {
      this.loaded = true;
    });
    if (this.autoplay) {
      const playAfterUserGesture = () => {
        this.video.play();
        window.removeEventListener("click", playAfterUserGesture);
        window.removeEventListener("touchstart", playAfterUserGesture);
      };
      window.addEventListener("click", playAfterUserGesture);
      window.addEventListener("touchstart", playAfterUserGesture);
    }
  }
  applyTexture() {
    const mat = this.material;
    const shader = mat.shader;
    const texture = this.texture = new Texture(this.engine, this.video);
    if (!setFirstMaterialTexture(mat, texture, this.textureProperty)) {
      console.error("Shader", shader, "not supported by video-texture");
    }
    if ("requestVideoFrameCallback" in this.video) {
      this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
    } else {
      this.video.addEventListener("timeupdate", () => {
        this.frameUpdateRequested = true;
      });
    }
  }
  update(dt) {
    if (this.loaded && this.frameUpdateRequested) {
      if (this.texture) {
        this.texture.update();
      } else {
        this.applyTexture();
      }
      this.frameUpdateRequested = false;
    }
  }
  updateVideo() {
    this.frameUpdateRequested = true;
    this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
  }
};
__publicField(VideoTexture, "TypeName", "video-texture");
__publicField(VideoTexture, "Properties", {
  /** URL to download video from */
  url: Property.string(),
  /** Material to apply the video texture to */
  material: Property.material(),
  /** Whether to loop the video */
  loop: Property.bool(true),
  /** Whether to automatically start playing the video */
  autoplay: Property.bool(true),
  /** Whether to mute sound */
  muted: Property.bool(true),
  /** Name of the texture property to set */
  textureProperty: Property.string("auto")
});

// node_modules/@wonderlandengine/components/dist/vr-mode-active-switch.js
var VrModeActiveSwitch = class extends Component {
  start() {
    this.components = [];
    this.getComponents(this.object);
    this.onXRSessionEnd();
    this.onSessionStartCallback = this.onXRSessionStart.bind(this);
    this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
  }
  onActivate() {
    this.engine.onXRSessionStart.add(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
  }
  onDeactivate() {
    this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
    this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
  }
  getComponents(obj) {
    const comps = obj.getComponents().filter((c) => c.type !== "vr-mode-active-switch");
    this.components = this.components.concat(comps);
    if (this.affectChildren) {
      let children = obj.children;
      for (let i = 0; i < children.length; ++i) {
        this.getComponents(children[i]);
      }
    }
  }
  setComponentsActive(active) {
    const comps = this.components;
    for (let i = 0; i < comps.length; ++i) {
      comps[i].active = active;
    }
  }
  onXRSessionStart() {
    this.setComponentsActive(this.activateComponents == 0);
  }
  onXRSessionEnd() {
    this.setComponentsActive(this.activateComponents != 0);
  }
};
__publicField(VrModeActiveSwitch, "TypeName", "vr-mode-active-switch");
__publicField(VrModeActiveSwitch, "Properties", {
  /** When components should be active: In VR or when not in VR */
  activateComponents: {
    type: Type.Enum,
    values: ["in VR", "in non-VR"],
    default: "in VR"
  },
  /** Whether child object's components should be affected */
  affectChildren: { type: Type.Bool, default: true }
});

// node_modules/@wonderlandengine/components/dist/plane-detection.js
var import_earcut = __toESM(require_earcut(), 1);
var __decorate10 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var tempVec32 = new Float32Array(3);
function extentsFromContour(out, points) {
  if (points.length == 0)
    return out;
  let absMaxX = Math.abs(points[0].x);
  let absMaxZ = Math.abs(points[0].z);
  for (let i = 1; i < points.length; ++i) {
    absMaxX = Math.max(absMaxX, Math.abs(points[i].x));
    absMaxZ = Math.max(absMaxZ, Math.abs(points[i].z));
  }
  out[0] = absMaxX;
  out[1] = 0;
  out[2] = absMaxZ;
}
function planeMeshFromContour(engine2, points, meshToUpdate = null) {
  const vertexCount = points.length;
  const vertices = new Float32Array(vertexCount * 2);
  for (let i = 0, d = 0; i < vertexCount; ++i, d += 2) {
    vertices[d] = points[i].x;
    vertices[d + 1] = points[i].z;
  }
  const triangles = (0, import_earcut.default)(vertices);
  const mesh = meshToUpdate || new Mesh(engine2, {
    vertexCount,
    /* Assumption here that we will never have more than 256 points
     * in the detected plane meshes! */
    indexType: MeshIndexType.UnsignedByte,
    indexData: triangles
  });
  if (mesh.vertexCount !== vertexCount) {
    console.warn("vertexCount of meshToUpdate did not match required vertexCount");
    return mesh;
  }
  const positions = mesh.attribute(MeshAttribute.Position);
  const textureCoords = mesh.attribute(MeshAttribute.TextureCoordinate);
  const normals = mesh.attribute(MeshAttribute.Normal);
  tempVec32[1] = 0;
  for (let i = 0, s = 0; i < vertexCount; ++i, s += 2) {
    tempVec32[0] = vertices[s];
    tempVec32[2] = vertices[s + 1];
    positions.set(i, tempVec32);
  }
  textureCoords?.set(0, vertices);
  if (normals) {
    tempVec32[0] = 0;
    tempVec32[1] = 1;
    tempVec32[2] = 0;
    for (let i = 0; i < vertexCount; ++i) {
      normals.set(i, tempVec32);
    }
  }
  if (meshToUpdate)
    mesh.update();
  return mesh;
}
var _planeLost, planeLost_fn, _planeFound, planeFound_fn, _planeUpdate, planeUpdate_fn, _planeUpdatePose, planeUpdatePose_fn;
var PlaneDetection = class extends Component {
  constructor() {
    super(...arguments);
    __privateAdd(this, _planeLost);
    __privateAdd(this, _planeFound);
    __privateAdd(this, _planeUpdate);
    __privateAdd(this, _planeUpdatePose);
    /**
     * Material to assign to created plane meshes or `null` if meshes should not be created.
     */
    __publicField(this, "planeMaterial", null);
    /**
     * Collision mask to assign to newly created collision components or a negative value if
     * collision components should not be created.
     */
    __publicField(this, "collisionMask", -1);
    /** Map of all planes and their last updated timestamps */
    __publicField(this, "planes", /* @__PURE__ */ new Map());
    /** Objects generated for each XRPlane */
    __publicField(this, "planeObjects", /* @__PURE__ */ new Map());
    /** Called when a plane starts tracking */
    __publicField(this, "onPlaneFound", new Emitter());
    /** Called when a plane stops tracking */
    __publicField(this, "onPlaneLost", new Emitter());
  }
  update() {
    if (!this.engine.xr?.frame)
      return;
    if (this.engine.xr.frame.detectedPlanes === void 0) {
      console.error("plane-detection: WebXR feature not available.");
      this.active = false;
      return;
    }
    const detectedPlanes = this.engine.xr.frame.detectedPlanes;
    for (const [plane, _] of this.planes) {
      if (!detectedPlanes.has(plane)) {
        __privateMethod(this, _planeLost, planeLost_fn).call(this, plane);
      }
    }
    detectedPlanes.forEach((plane) => {
      if (this.planes.has(plane)) {
        if (plane.lastChangedTime > this.planes.get(plane)) {
          __privateMethod(this, _planeUpdate, planeUpdate_fn).call(this, plane);
        }
      } else {
        __privateMethod(this, _planeFound, planeFound_fn).call(this, plane);
      }
      __privateMethod(this, _planeUpdatePose, planeUpdatePose_fn).call(this, plane);
    });
  }
};
_planeLost = new WeakSet();
planeLost_fn = function(plane) {
  this.planes.delete(plane);
  const o = this.planeObjects.get(plane);
  this.onPlaneLost.notify(plane, o);
  if (o.objectId > 0)
    o.destroy();
};
_planeFound = new WeakSet();
planeFound_fn = function(plane) {
  this.planes.set(plane, plane.lastChangedTime);
  const o = this.engine.scene.addObject(this.object);
  this.planeObjects.set(plane, o);
  if (this.planeMaterial) {
    o.addComponent(MeshComponent, {
      mesh: planeMeshFromContour(this.engine, plane.polygon),
      material: this.planeMaterial
    });
  }
  if (this.collisionMask >= 0) {
    extentsFromContour(tempVec32, plane.polygon);
    tempVec32[1] = 0.025;
    o.addComponent(CollisionComponent, {
      group: this.collisionMask,
      collider: Collider.Box,
      extents: tempVec32
    });
  }
  this.onPlaneFound.notify(plane, o);
};
_planeUpdate = new WeakSet();
planeUpdate_fn = function(plane) {
  this.planes.set(plane, plane.lastChangedTime);
  const planeMesh = this.planeObjects.get(plane).getComponent(MeshComponent);
  if (!planeMesh)
    return;
  planeMeshFromContour(this.engine, plane.polygon, planeMesh.mesh);
};
_planeUpdatePose = new WeakSet();
planeUpdatePose_fn = function(plane) {
  const o = this.planeObjects.get(plane);
  const pose = this.engine.xr.frame.getPose(plane.planeSpace, this.engine.xr.currentReferenceSpace);
  if (!pose) {
    o.active = false;
    return;
  }
  setXRRigidTransformLocal(o, pose.transform);
};
__publicField(PlaneDetection, "TypeName", "plane-detection");
__decorate10([
  property.material()
], PlaneDetection.prototype, "planeMaterial", void 0);
__decorate10([
  property.int()
], PlaneDetection.prototype, "collisionMask", void 0);

// node_modules/@wonderlandengine/components/dist/vrm.js
var VRM_ROLL_AXES = {
  X: [1, 0, 0],
  Y: [0, 1, 0],
  Z: [0, 0, 1]
};
var VRM_AIM_AXES = {
  PositiveX: [1, 0, 0],
  NegativeX: [-1, 0, 0],
  PositiveY: [0, 1, 0],
  NegativeY: [0, -1, 0],
  PositiveZ: [0, 0, 1],
  NegativeZ: [0, 0, -1]
};
var Vrm = class extends Component {
  /** Meta information about the VRM model */
  meta = null;
  /** The humanoid bones of the VRM model */
  bones = {
    /* Torso */
    hips: null,
    spine: null,
    chest: null,
    upperChest: null,
    neck: null,
    /* Head */
    head: null,
    leftEye: null,
    rightEye: null,
    jaw: null,
    /* Legs */
    leftUpperLeg: null,
    leftLowerLeg: null,
    leftFoot: null,
    leftToes: null,
    rightUpperLeg: null,
    rightLowerLeg: null,
    rightFoot: null,
    rightToes: null,
    /* Arms */
    leftShoulder: null,
    leftUpperArm: null,
    leftLowerArm: null,
    leftHand: null,
    rightShoulder: null,
    rightUpperArm: null,
    rightLowerArm: null,
    rightHand: null,
    /* Fingers */
    leftThumbMetacarpal: null,
    leftThumbProximal: null,
    leftThumbDistal: null,
    leftIndexProximal: null,
    leftIndexIntermediate: null,
    leftIndexDistal: null,
    leftMiddleProximal: null,
    leftMiddleIntermediate: null,
    leftMiddleDistal: null,
    leftRingProximal: null,
    leftRingIntermediate: null,
    leftRingDistal: null,
    leftLittleProximal: null,
    leftLittleIntermediate: null,
    leftLittleDistal: null,
    rightThumbMetacarpal: null,
    rightThumbProximal: null,
    rightThumbDistal: null,
    rightIndexProximal: null,
    rightIndexIntermediate: null,
    rightIndexDistal: null,
    rightMiddleProximal: null,
    rightMiddleIntermediate: null,
    rightMiddleDistal: null,
    rightRingProximal: null,
    rightRingIntermediate: null,
    rightRingDistal: null,
    rightLittleProximal: null,
    rightLittleIntermediate: null,
    rightLittleDistal: null
  };
  /** Rotations of the bones in the rest pose (T-pose) */
  restPose = {};
  /* All node constraints, ordered to deal with dependencies */
  _nodeConstraints = [];
  /* VRMC_springBone chains */
  _springChains = [];
  /* Spherical colliders for spring bones */
  _sphereColliders = [];
  /* Capsule shaped colliders for spring bones */
  _capsuleColliders = [];
  /* Indicates which meshes are rendered in first/third person views */
  _firstPersonAnnotations = [];
  /* Contains details for (bone type) lookAt behaviour */
  _lookAt = null;
  /* Whether or not the VRM component has been initialized with `initializeVrm` */
  _initialized = false;
  init() {
    this._tempV3 = vec3_exports.create();
    this._tempV3A = vec3_exports.create();
    this._tempV3B = vec3_exports.create();
    this._tempQuat = quat_exports.create();
    this._tempQuatA = quat_exports.create();
    this._tempQuatB = quat_exports.create();
    this._tempMat4A = mat4_exports.create();
    this._tempQuat2 = quat2_exports.create();
    this._tailToShape = vec3_exports.create();
    this._headToTail = vec3_exports.create();
    this._inertia = vec3_exports.create();
    this._stiffness = vec3_exports.create();
    this._external = vec3_exports.create();
    this._rightVector = vec3_exports.set(vec3_exports.create(), 1, 0, 0);
    this._upVector = vec3_exports.set(vec3_exports.create(), 0, 1, 0);
    this._forwardVector = vec3_exports.set(vec3_exports.create(), 0, 0, 1);
    this._identityQuat = quat_exports.identity(quat_exports.create());
    this._rad2deg = 180 / Math.PI;
  }
  start() {
    if (!this.src) {
      console.error("vrm: src property not set");
      return;
    }
    this.engine.scene.append(this.src, { loadGltfExtensions: true }).then(({ root, extensions }) => {
      root.children.forEach((child) => child.parent = this.object);
      this._initializeVrm(extensions);
      root.destroy();
    });
  }
  /**
   * Parses the VRM glTF extensions and initializes the vrm component.
   * @param {GLTFExtensions} extensions The glTF extensions for the VRM model
   */
  _initializeVrm(extensions) {
    if (this._initialized) {
      throw Error("VRM component has already been initialized");
    }
    const VRMC_vrm = extensions.root["VRMC_vrm"];
    if (!VRMC_vrm) {
      throw Error("Missing VRM extensions");
    }
    if (VRMC_vrm.specVersion !== "1.0") {
      throw Error(`Unsupported VRM version, only 1.0 is supported, but encountered '${VRMC_vrm.specVersion}'`);
    }
    this.meta = VRMC_vrm.meta;
    this._parseHumanoid(VRMC_vrm.humanoid, extensions);
    if (VRMC_vrm.firstPerson) {
      this._parseFirstPerson(VRMC_vrm.firstPerson, extensions);
    }
    if (VRMC_vrm.lookAt) {
      this._parseLookAt(VRMC_vrm.lookAt);
    }
    this._findAndParseNodeConstraints(extensions);
    const springBone = extensions.root["VRMC_springBone"];
    if (springBone) {
      this._parseAndInitializeSpringBones(springBone, extensions);
    }
    this._initialized = true;
  }
  _parseHumanoid(humanoid, extensions) {
    for (const boneName in humanoid.humanBones) {
      if (!(boneName in this.bones)) {
        console.warn(`Unrecognized bone '${boneName}'`);
        continue;
      }
      const node = humanoid.humanBones[boneName].node;
      const objectId = extensions.idMapping[node];
      this.bones[boneName] = this.engine.wrapObject(objectId);
      this.restPose[boneName] = quat_exports.copy(quat_exports.create(), this.bones[boneName].rotationLocal);
    }
  }
  _parseFirstPerson(firstPerson, extensions) {
    for (const meshAnnotation of firstPerson.meshAnnotations) {
      const annotation = {
        node: this.engine.wrapObject(extensions.idMapping[meshAnnotation.node]),
        firstPerson: true,
        thirdPerson: true
      };
      switch (meshAnnotation.type) {
        case "firstPersonOnly":
          annotation.thirdPerson = false;
          break;
        case "thirdPersonOnly":
          annotation.firstPerson = false;
          break;
        case "both":
          break;
        case "auto":
          console.warn("First person mesh annotation type 'auto' is not supported, treating as 'both'!");
          break;
        default:
          console.error(`Invalid mesh annotation type '${meshAnnotation.type}'`);
          break;
      }
      this._firstPersonAnnotations.push(annotation);
    }
  }
  _parseLookAt(lookAt2) {
    if (lookAt2.type !== "bone") {
      console.warn(`Unsupported lookAt type '${lookAt2.type}', only 'bone' is supported`);
      return;
    }
    const parseRangeMap = (rangeMap) => {
      return {
        inputMaxValue: rangeMap.inputMaxValue,
        outputScale: rangeMap.outputScale
      };
    };
    this._lookAt = {
      offsetFromHeadBone: lookAt2.offsetFromHeadBone || [0, 0, 0],
      horizontalInner: parseRangeMap(lookAt2.rangeMapHorizontalInner),
      horizontalOuter: parseRangeMap(lookAt2.rangeMapHorizontalOuter),
      verticalDown: parseRangeMap(lookAt2.rangeMapVerticalDown),
      verticalUp: parseRangeMap(lookAt2.rangeMapVerticalUp)
    };
  }
  _findAndParseNodeConstraints(extensions) {
    const traverse = (object) => {
      const nodeExtensions = extensions.node[object.objectId];
      if (nodeExtensions && "VRMC_node_constraint" in nodeExtensions) {
        const nodeConstraintExtension = nodeExtensions["VRMC_node_constraint"];
        const constraint = nodeConstraintExtension.constraint;
        let type, axis;
        if ("roll" in constraint) {
          type = "roll";
          axis = VRM_ROLL_AXES[constraint.roll.rollAxis];
        } else if ("aim" in constraint) {
          type = "aim";
          axis = VRM_AIM_AXES[constraint.aim.aimAxis];
        } else if ("rotation" in constraint) {
          type = "rotation";
        }
        if (type) {
          const source = this.engine.wrapObject(extensions.idMapping[constraint[type].source]);
          this._nodeConstraints.push({
            type,
            source,
            destination: object,
            axis,
            weight: constraint[type].weight,
            /* Rest pose */
            destinationRestLocalRotation: quat_exports.copy(quat_exports.create(), object.rotationLocal),
            sourceRestLocalRotation: quat_exports.copy(quat_exports.create(), source.rotationLocal),
            sourceRestLocalRotationInv: quat_exports.invert(quat_exports.create(), source.rotationLocal)
          });
        } else {
          console.warn("Unrecognized or invalid VRMC_node_constraint, ignoring it");
        }
      }
      for (const child of object.children) {
        traverse(child);
      }
    };
    traverse(this.object);
  }
  _parseAndInitializeSpringBones(springBone, extensions) {
    const colliders = (springBone.colliders || []).map((collider, i) => {
      const shapeType = "capsule" in collider.shape ? "capsule" : "sphere";
      return {
        id: i,
        object: this.engine.wrapObject(extensions.idMapping[collider.node]),
        shape: {
          isCapsule: shapeType === "capsule",
          radius: collider.shape[shapeType].radius,
          offset: collider.shape[shapeType].offset,
          tail: collider.shape[shapeType].tail
        },
        cache: {
          head: vec3_exports.create(),
          tail: vec3_exports.create()
        }
      };
    });
    this._sphereColliders = colliders.filter((c) => !c.shape.isCapsule);
    this._capsuleColliders = colliders.filter((c) => c.shape.isCapsule);
    const colliderGroups = (springBone.colliderGroups || []).map((group) => ({
      name: group.name,
      colliders: group.colliders.map((c) => colliders[c])
    }));
    for (const spring of springBone.springs) {
      const joints = [];
      for (const joint of spring.joints) {
        const springJoint = {
          hitRadius: 0,
          stiffness: 1,
          gravityPower: 0,
          gravityDir: [0, -1, 0],
          dragForce: 0.5,
          node: null,
          state: null
        };
        Object.assign(springJoint, joint);
        springJoint.node = this.engine.wrapObject(extensions.idMapping[springJoint.node]);
        joints.push(springJoint);
      }
      const springChainColliders = (spring.colliderGroups || []).flatMap((cg) => colliderGroups[cg].colliders);
      this._springChains.push({
        name: spring.name,
        center: spring.center ? this.engine.wrapObject(extensions.idMapping[spring.center]) : null,
        joints,
        sphereColliders: springChainColliders.filter((c) => !c.shape.isCapsule),
        capsuleColliders: springChainColliders.filter((c) => c.shape.isCapsule)
      });
    }
    for (const springChain of this._springChains) {
      for (let i = 0; i < springChain.joints.length - 1; ++i) {
        const springBoneJoint = springChain.joints[i];
        const childSpringBoneJoint = springChain.joints[i + 1];
        const springBonePosition = springBoneJoint.node.getTranslationWorld(vec3_exports.create());
        const childSpringBonePosition = childSpringBoneJoint.node.getTranslationWorld(vec3_exports.create());
        const boneDirection = vec3_exports.subtract(this._tempV3A, springBonePosition, childSpringBonePosition);
        const state = {
          prevTail: childSpringBonePosition,
          currentTail: vec3_exports.copy(vec3_exports.create(), childSpringBonePosition),
          initialLocalRotation: quat_exports.copy(quat_exports.create(), springBoneJoint.node.rotationLocal),
          initialLocalTransformInvert: quat2_exports.invert(quat2_exports.create(), springBoneJoint.node.transformLocal),
          boneAxis: vec3_exports.normalize(vec3_exports.create(), childSpringBoneJoint.node.getTranslationLocal(this._tempV3)),
          /* Ensure bone length is at least 1cm to avoid jittery behaviour from zero-length bones */
          boneLength: Math.max(0.01, vec3_exports.length(boneDirection)),
          /* Tail positions in center space, if needed */
          prevTailCenter: null,
          currentTailCenter: null
        };
        if (springChain.center) {
          state.prevTailCenter = springChain.center.transformPointInverseWorld(vec3_exports.create(), childSpringBonePosition);
          state.currentTailCenter = vec3_exports.copy(vec3_exports.create(), childSpringBonePosition);
        }
        springBoneJoint.state = state;
      }
    }
  }
  update(dt) {
    if (!this._initialized) {
      return;
    }
    this._resolveLookAt();
    this._resolveConstraints();
    this._updateSpringBones(dt);
  }
  _rangeMap(rangeMap, input) {
    const maxValue = rangeMap.inputMaxValue;
    const outputScale = rangeMap.outputScale;
    return Math.min(input, maxValue) / maxValue * outputScale;
  }
  _resolveLookAt() {
    if (!this._lookAt || !this.lookAtTarget) {
      return;
    }
    const lookAtSource = this.bones.head.transformPointWorld(this._tempV3A, this._lookAt.offsetFromHeadBone);
    const lookAtTarget = this.lookAtTarget.getTranslationWorld(this._tempV3B);
    const lookAtDirection = vec3_exports.sub(this._tempV3A, lookAtTarget, lookAtSource);
    vec3_exports.normalize(lookAtDirection, lookAtDirection);
    this.bones.head.parent.transformVectorInverseWorld(lookAtDirection);
    const z = vec3_exports.dot(lookAtDirection, this._forwardVector);
    const x = vec3_exports.dot(lookAtDirection, this._rightVector);
    const yaw = Math.atan2(x, z) * this._rad2deg;
    const xz = Math.sqrt(x * x + z * z);
    const y = vec3_exports.dot(lookAtDirection, this._upVector);
    let pitch = Math.atan2(-y, xz) * this._rad2deg;
    if (pitch > 0) {
      pitch = this._rangeMap(this._lookAt.verticalDown, pitch);
    } else {
      pitch = -this._rangeMap(this._lookAt.verticalUp, -pitch);
    }
    if (this.bones.leftEye) {
      let yawLeft = yaw;
      if (yawLeft > 0) {
        yawLeft = this._rangeMap(this._lookAt.horizontalInner, yawLeft);
      } else {
        yawLeft = -this._rangeMap(this._lookAt.horizontalOuter, -yawLeft);
      }
      const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawLeft, 0);
      this.bones.leftEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.leftEye, eyeRotation);
    }
    if (this.bones.rightEye) {
      let yawRight = yaw;
      if (yawRight > 0) {
        yawRight = this._rangeMap(this._lookAt.horizontalOuter, yawRight);
      } else {
        yawRight = -this._rangeMap(this._lookAt.horizontalInner, -yawRight);
      }
      const eyeRotation = quat_exports.fromEuler(this._tempQuatA, pitch, yawRight, 0);
      this.bones.rightEye.rotationLocal = quat_exports.multiply(eyeRotation, this.restPose.rightEye, eyeRotation);
    }
  }
  _resolveConstraints() {
    for (const nodeConstraint of this._nodeConstraints) {
      this._resolveConstraint(nodeConstraint);
    }
  }
  _resolveConstraint(nodeConstraint) {
    const dstRestQuat = nodeConstraint.destinationRestLocalRotation;
    const srcRestQuatInv = nodeConstraint.sourceRestLocalRotationInv;
    const targetQuat = quat_exports.identity(this._tempQuatA);
    switch (nodeConstraint.type) {
      case "roll":
        {
          const deltaSrcQuat = quat_exports.multiply(this._tempQuatA, srcRestQuatInv, nodeConstraint.source.rotationLocal);
          const deltaSrcQuatInParent = quat_exports.multiply(this._tempQuatA, nodeConstraint.sourceRestLocalRotation, deltaSrcQuat);
          quat_exports.mul(deltaSrcQuatInParent, deltaSrcQuatInParent, srcRestQuatInv);
          const dstRestQuatInv = quat_exports.invert(this._tempQuatB, dstRestQuat);
          const deltaSrcQuatInDst = quat_exports.multiply(this._tempQuatB, dstRestQuatInv, deltaSrcQuatInParent);
          quat_exports.multiply(deltaSrcQuatInDst, deltaSrcQuatInDst, dstRestQuat);
          const toVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, deltaSrcQuatInDst);
          const fromToQuat = quat_exports.rotationTo(this._tempQuatA, nodeConstraint.axis, toVec);
          quat_exports.mul(targetQuat, dstRestQuat, quat_exports.invert(this._tempQuat, fromToQuat));
          quat_exports.mul(targetQuat, targetQuat, deltaSrcQuatInDst);
        }
        break;
      case "aim":
        {
          const dstParentWorldQuat = nodeConstraint.destination.parent.rotationWorld;
          const fromVec = vec3_exports.transformQuat(this._tempV3A, nodeConstraint.axis, dstRestQuat);
          vec3_exports.transformQuat(fromVec, fromVec, dstParentWorldQuat);
          const toVec = nodeConstraint.source.getTranslationWorld(this._tempV3B);
          vec3_exports.sub(toVec, toVec, nodeConstraint.destination.getTranslationWorld(this._tempV3));
          vec3_exports.normalize(toVec, toVec);
          const fromToQuat = quat_exports.rotationTo(this._tempQuatA, fromVec, toVec);
          quat_exports.mul(targetQuat, quat_exports.invert(this._tempQuat, dstParentWorldQuat), fromToQuat);
          quat_exports.mul(targetQuat, targetQuat, dstParentWorldQuat);
          quat_exports.mul(targetQuat, targetQuat, dstRestQuat);
        }
        break;
      case "rotation":
        {
          const srcDeltaQuat = quat_exports.mul(targetQuat, srcRestQuatInv, nodeConstraint.source.rotationLocal);
          quat_exports.mul(targetQuat, dstRestQuat, srcDeltaQuat);
        }
        break;
    }
    quat_exports.slerp(targetQuat, dstRestQuat, targetQuat, nodeConstraint.weight);
    nodeConstraint.destination.rotationLocal = targetQuat;
  }
  _updateSpringBones(dt) {
    this._sphereColliders.forEach(({ object, shape, cache }) => {
      const offset2 = vec3_exports.copy(cache.head, shape.offset);
      object.transformVectorWorld(offset2);
      vec3_exports.add(cache.head, object.getTranslationWorld(this._tempV3), offset2);
    });
    this._capsuleColliders.forEach(({ object, shape, cache }) => {
      const shapeCenter = object.getTranslationWorld(this._tempV3A);
      const headOffset = vec3_exports.copy(cache.head, shape.offset);
      object.transformVectorWorld(headOffset);
      vec3_exports.add(cache.head, shapeCenter, headOffset);
      const tailOffset = vec3_exports.copy(cache.tail, shape.tail);
      object.transformVectorWorld(tailOffset);
      vec3_exports.add(cache.tail, shapeCenter, tailOffset);
    });
    this._springChains.forEach((springChain) => {
      for (let i = 0; i < springChain.joints.length - 1; ++i) {
        const joint = springChain.joints[i];
        const parentWorldRotation = joint.node.parent ? joint.node.parent.rotationWorld : this._identityQuat;
        const inertia = this._inertia;
        if (springChain.center) {
          vec3_exports.sub(inertia, joint.state.currentTailCenter, joint.state.prevTailCenter);
          springChain.center.transformVectorWorld(inertia);
        } else {
          vec3_exports.sub(inertia, joint.state.currentTail, joint.state.prevTail);
        }
        vec3_exports.scale(inertia, inertia, 1 - joint.dragForce);
        const stiffness = vec3_exports.copy(this._stiffness, joint.state.boneAxis);
        vec3_exports.transformQuat(stiffness, stiffness, joint.state.initialLocalRotation);
        vec3_exports.transformQuat(stiffness, stiffness, parentWorldRotation);
        vec3_exports.scale(stiffness, stiffness, dt * joint.stiffness);
        const external = vec3_exports.scale(this._external, joint.gravityDir, dt * joint.gravityPower);
        const nextTail = vec3_exports.copy(this._tempV3A, joint.state.currentTail);
        vec3_exports.add(nextTail, nextTail, inertia);
        vec3_exports.add(nextTail, nextTail, stiffness);
        vec3_exports.add(nextTail, nextTail, external);
        const worldPosition = joint.node.getTranslationWorld(this._tempV3B);
        vec3_exports.sub(nextTail, nextTail, worldPosition);
        vec3_exports.normalize(nextTail, nextTail);
        vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
        for (const { shape, cache } of springChain.sphereColliders) {
          let tailToShape = this._tailToShape;
          const sphereCenter = cache.head;
          tailToShape = vec3_exports.sub(tailToShape, nextTail, sphereCenter);
          const radius = shape.radius + joint.hitRadius;
          const dist2 = vec3_exports.length(tailToShape) - radius;
          if (dist2 < 0) {
            vec3_exports.normalize(tailToShape, tailToShape);
            vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
            vec3_exports.sub(nextTail, nextTail, worldPosition);
            vec3_exports.normalize(nextTail, nextTail);
            vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
          }
        }
        for (const { shape, cache } of springChain.capsuleColliders) {
          let tailToShape = this._tailToShape;
          const head = cache.head;
          const tail = cache.tail;
          tailToShape = vec3_exports.sub(tailToShape, nextTail, head);
          const headToTail = vec3_exports.sub(this._headToTail, tail, head);
          const dot5 = vec3_exports.dot(headToTail, tailToShape);
          if (vec3_exports.squaredLength(headToTail) <= dot5) {
            vec3_exports.sub(tailToShape, nextTail, tail);
          } else if (dot5 > 0) {
            vec3_exports.scale(headToTail, headToTail, dot5 / vec3_exports.squaredLength(headToTail));
            vec3_exports.sub(tailToShape, tailToShape, headToTail);
          }
          const radius = shape.radius + joint.hitRadius;
          const dist2 = vec3_exports.length(tailToShape) - radius;
          if (dist2 < 0) {
            vec3_exports.normalize(tailToShape, tailToShape);
            vec3_exports.scaleAndAdd(nextTail, nextTail, tailToShape, -dist2);
            vec3_exports.sub(nextTail, nextTail, worldPosition);
            vec3_exports.normalize(nextTail, nextTail);
            vec3_exports.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
          }
        }
        vec3_exports.copy(joint.state.prevTail, joint.state.currentTail);
        vec3_exports.copy(joint.state.currentTail, nextTail);
        if (springChain.center) {
          vec3_exports.copy(joint.state.prevTailCenter, joint.state.currentTailCenter);
          vec3_exports.copy(joint.state.currentTailCenter, nextTail);
          springChain.center.transformPointInverseWorld(joint.state.currentTailCenter);
        }
        joint.node.parent.transformPointInverseWorld(nextTail);
        const nextTailDualQuat = quat2_exports.fromTranslation(this._tempQuat2, nextTail);
        quat2_exports.multiply(nextTailDualQuat, joint.state.initialLocalTransformInvert, nextTailDualQuat);
        quat2_exports.getTranslation(nextTail, nextTailDualQuat);
        vec3_exports.normalize(nextTail, nextTail);
        const jointRotation = quat_exports.rotationTo(this._tempQuatA, joint.state.boneAxis, nextTail);
        joint.node.rotationLocal = quat_exports.mul(this._tempQuatA, joint.state.initialLocalRotation, jointRotation);
      }
    });
  }
  /**
   * @param {boolean} firstPerson Whether the model should render for first person or third person views
   */
  set firstPerson(firstPerson) {
    this._firstPersonAnnotations.forEach((annotation) => {
      const visible = firstPerson == annotation.firstPerson || firstPerson != annotation.thirdPerson;
      annotation.node.getComponents("mesh").forEach((mesh) => {
        mesh.active = visible;
      });
    });
  }
};
__publicField(Vrm, "TypeName", "vrm");
__publicField(Vrm, "Properties", {
  /** URL to a VRM file to load */
  src: { type: Type.String },
  /** Object the VRM is looking at */
  lookAtTarget: { type: Type.Object }
});

// node_modules/@wonderlandengine/components/dist/wasd-controls.js
var _direction = new Float32Array(3);
var WasdControlsComponent = class extends Component {
  init() {
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    window.addEventListener("keydown", this.press.bind(this));
    window.addEventListener("keyup", this.release.bind(this));
  }
  start() {
    this.headObject = this.headObject || this.object;
  }
  update() {
    vec3_exports.zero(_direction);
    if (this.up)
      _direction[2] -= 1;
    if (this.down)
      _direction[2] += 1;
    if (this.left)
      _direction[0] -= 1;
    if (this.right)
      _direction[0] += 1;
    vec3_exports.normalize(_direction, _direction);
    _direction[0] *= this.speed;
    _direction[2] *= this.speed;
    vec3_exports.transformQuat(_direction, _direction, this.headObject.transformWorld);
    if (this.lockY) {
      _direction[1] = 0;
      vec3_exports.normalize(_direction, _direction);
      vec3_exports.scale(_direction, _direction, this.speed);
    }
    this.object.translateLocal(_direction);
  }
  press(e) {
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
      this.up = true;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      this.right = true;
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      this.down = true;
    } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
      this.left = true;
    }
  }
  release(e) {
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
      this.up = false;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      this.right = false;
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      this.down = false;
    } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
      this.left = false;
    }
  }
};
__publicField(WasdControlsComponent, "TypeName", "wasd-controls");
__publicField(WasdControlsComponent, "Properties", {
  /** Movement speed in m/s. */
  speed: { type: Type.Float, default: 0.1 },
  /** Flag for only moving the object on the global x & z planes */
  lockY: { type: Type.Bool, default: false },
  /** Object of which the orientation is used to determine forward direction */
  headObject: { type: Type.Object }
});

// node_modules/@wonderlandengine/components/dist/input-profile.js
var __decorate11 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _tempVec = vec3_exports.create();
var _tempQuat = quat_exports.create();
var _tempRotation1 = new Float32Array(4);
var _tempRotation2 = new Float32Array(4);
var minTemp = new Float32Array(3);
var maxTemp = new Float32Array(3);
var hands = ["left", "right"];
var _InputProfile = class extends Component {
  _gamepadObjects = {};
  _controllerModel = null;
  _defaultControllerComponents;
  _handedness;
  _profileJSON = null;
  _buttons = [];
  _axes = [];
  /**
   * The XR gamepad associated with the current input source.
   */
  gamepad;
  /**
   * A reference to the emitter which triggered on model lodaed event.
   */
  onModelLoaded = new Emitter();
  /**
   * Returns url of input profile json file
   */
  url;
  /**
   * A set of components to filter during component retrieval.
   */
  toFilter = /* @__PURE__ */ new Set(["vr-mode-active-mode-switch"]);
  /**
   * The index representing the handedness of the controller (0 for left, 1 for right).
   */
  handedness = 0;
  /**
   * The base path where XR input profiles are stored.
   */
  defaultBasePath;
  /**
   * An optional folder path for loading custom XR input profiles.
   */
  customBasePath;
  /**
   * The default 3D controller model used when a custom model fails to load.
   */
  defaultController;
  /**
   * The object which has HandTracking component added to it.
   */
  trackedHand;
  /**
   * If true, the input profile will be mapped to the default controller, and no dynamic 3D model of controller will be loaded.
   */
  mapToDefaultController;
  /**
   * If true, adds a VR mode switch component to the loaded controller model.
   */
  addVrModeSwitch;
  onActivate() {
    this._handedness = hands[this.handedness];
    const defaultHandName = "Hand" + this._handedness.charAt(0).toUpperCase() + this._handedness.slice(1);
    this.trackedHand = this.trackedHand ?? this.object.parent?.findByNameRecursive(defaultHandName)[0];
    this.defaultController = this.defaultController || this.object.children[0];
    this._defaultControllerComponents = this._getComponents(this.defaultController);
    this.engine.onXRSessionStart.add(() => {
      this.engine.xr?.session.addEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
    });
  }
  onDeactivate() {
    this.engine.xr?.session?.removeEventListener("inputsourceschange", this._onInputSourcesChange.bind(this));
  }
  /**
   * Sets newly loaded controllers for the HandTracking component to proper switching.
   * @param controllerObject The controller object.
   * @hidden
   */
  _setHandTrackingControllers(controllerObject) {
    const handtrackingComponent = this.trackedHand.getComponent(HandTracking);
    if (!handtrackingComponent)
      return;
    handtrackingComponent.controllerToDeactivate = controllerObject;
  }
  /**
   * Retrieves all components from the specified object and its children.
   * @param obj The object to retrieve components from.
   * @return An array of components.
   * @hidden
   */
  _getComponents(obj) {
    const components = [];
    if (obj == null)
      return components;
    const stack = [obj];
    while (stack.length > 0) {
      const currentObj = stack.pop();
      const comps = currentObj.getComponents().filter((c) => !this.toFilter.has(c.type));
      components.push(...comps);
      const children = currentObj.children;
      for (let i = children.length - 1; i >= 0; --i) {
        stack.push(children[i]);
      }
    }
    return components;
  }
  /**
   * Activates or deactivates components based on the specified boolean value.
   * @param active If true, components are set to active; otherwise, they are set to inactive.
   * @hidden
   */
  _setComponentsActive(active) {
    const comps = this._defaultControllerComponents;
    if (comps == void 0)
      return;
    for (let i = 0; i < comps.length; ++i) {
      comps[i].active = active;
    }
  }
  /**
   * Event handler triggered when XR input sources change.
   * Detects new XR input sources and initiates the loading of input profiles.
   * @param event The XR input source change event.
   * @hidden
   */
  _onInputSourcesChange(event) {
    if (this._isModelLoaded() && !this.mapToDefaultController) {
      this._setComponentsActive(false);
    }
    event.added.forEach((xrInputSource) => {
      if (xrInputSource.hand != null)
        return;
      if (this._handedness != xrInputSource.handedness)
        return;
      this.gamepad = xrInputSource.gamepad;
      const profile = this.customBasePath !== "" ? this.customBasePath : this.defaultBasePath + xrInputSource.profiles[0];
      this.url = profile + "/profile.json";
      this._profileJSON = _InputProfile.Cache.get(this.url) ?? null;
      if (this._profileJSON != null)
        return;
      fetch(this.url).then((res) => res.json()).then((out) => {
        this._profileJSON = out;
        _InputProfile.Cache.set(this.url, this._profileJSON);
        if (!this._isModelLoaded())
          this._loadAndMapGamepad(profile);
      }).catch((e) => {
        console.error(`Failed to load profile from ${this.url}. Reason:`, e);
      });
    });
  }
  /**
   * Checks if the 3D controller model is loaded.
   * @return True if the model is loaded; otherwise, false.
   * @hidden
   */
  _isModelLoaded() {
    return this._controllerModel !== null;
  }
  /**
   * Loads the 3D controller model and caches the mapping to the gamepad.
   * @param profile The path to the input profile.
   * @hidden
   */
  async _loadAndMapGamepad(profile) {
    const assetPath = profile + "/" + this._handedness + ".glb";
    this._controllerModel = this.defaultController;
    if (!this.mapToDefaultController) {
      try {
        this._controllerModel = await this.engine.scene.append(assetPath);
      } catch (e) {
        console.error(`Failed to load i-p controller model. Reason:`, e, `Continuing with ${this._handedness} default controller.`);
        this._setComponentsActive(true);
      }
      this._controllerModel.parent = this.object;
      this._controllerModel.setPositionLocal([0, 0, 0]);
      this._setComponentsActive(false);
      if (this.addVrModeSwitch)
        this._controllerModel.addComponent(VrModeActiveSwitch);
      this.onModelLoaded.notify();
    }
    this._cacheGamepadObjectsFromProfile(this._profileJSON, this._controllerModel);
    this._setHandTrackingControllers(this._controllerModel);
    this.update = () => this._mapGamepadInput();
  }
  /**
   * Caches gamepad objects (buttons, axes) from the loaded input profile.
   * @hidden
   */
  _cacheGamepadObjectsFromProfile(profile, obj) {
    const components = profile.layouts[this._handedness].components;
    if (!components)
      return;
    this._buttons = [];
    this._axes = [];
    for (const i in components) {
      const visualResponses = components[i].visualResponses;
      for (const j in visualResponses) {
        const visualResponse = visualResponses[j];
        const valueNode = visualResponse.valueNodeName;
        const minNode = visualResponse.minNodeName;
        const maxNode = visualResponse.maxNodeName;
        this._gamepadObjects[valueNode] = obj.findByNameRecursive(valueNode)[0];
        this._gamepadObjects[minNode] = obj.findByNameRecursive(minNode)[0];
        this._gamepadObjects[maxNode] = obj.findByNameRecursive(maxNode)[0];
        const indice = visualResponses[j].componentProperty;
        const response = {
          target: this._gamepadObjects[valueNode],
          min: this._gamepadObjects[minNode],
          max: this._gamepadObjects[maxNode],
          id: components[i].gamepadIndices[indice]
          // Assign a unique ID
        };
        switch (indice) {
          case "button":
            this._buttons.push(response);
            break;
          case "xAxis":
          case "yAxis":
            this._axes.push(response);
            break;
        }
      }
    }
  }
  /**
   * Assigns a transformed position and rotation to the target based on minimum and maximum values and a normalized input value.
   * @param target The target object to be transformed.
   * @param min The minimum object providing transformation limits.
   * @param max The maximum object providing transformation limits.
   * @param value The normalized input value.
   * @hidden
   */
  _assignTransform(target, min2, max2, value) {
    vec3_exports.lerp(_tempVec, min2.getPositionWorld(minTemp), max2.getPositionWorld(maxTemp), value);
    target.setPositionWorld(_tempVec);
    quat_exports.lerp(_tempQuat, min2.getRotationWorld(_tempRotation1), max2.getRotationWorld(_tempRotation2), value);
    quat_exports.normalize(_tempQuat, _tempQuat);
    target.setRotationWorld(_tempQuat);
  }
  /**
   * Maps input values (buttons, axes) to the 3D controller model.
   * @hidden
   */
  _mapGamepadInput() {
    for (const button of this._buttons) {
      const buttonValue = this.gamepad.buttons[button.id].value;
      this._assignTransform(button.target, button.min, button.max, buttonValue);
    }
    for (const axis of this._axes) {
      const axisValue = this.gamepad.axes[axis.id];
      const normalizedAxisValue = (axisValue + 1) / 2;
      this._assignTransform(axis.target, axis.min, axis.max, normalizedAxisValue);
    }
  }
};
var InputProfile = _InputProfile;
__publicField(InputProfile, "TypeName", "input-profile");
/**
 * A cache to store loaded profiles for reuse.
 */
__publicField(InputProfile, "Cache", /* @__PURE__ */ new Map());
__decorate11([
  property.enum(hands, 0)
], InputProfile.prototype, "handedness", void 0);
__decorate11([
  property.string("https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@latest/dist/profiles/")
], InputProfile.prototype, "defaultBasePath", void 0);
__decorate11([
  property.string()
], InputProfile.prototype, "customBasePath", void 0);
__decorate11([
  property.object()
], InputProfile.prototype, "defaultController", void 0);
__decorate11([
  property.object()
], InputProfile.prototype, "trackedHand", void 0);
__decorate11([
  property.bool(false)
], InputProfile.prototype, "mapToDefaultController", void 0);
__decorate11([
  property.bool(true)
], InputProfile.prototype, "addVrModeSwitch", void 0);

// node_modules/@wonderlandengine/components/dist/orbital-camera.js
var __decorate12 = function(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var preventDefault2 = (e) => {
  e.preventDefault();
};
var tempVec4 = [0, 0, 0];
var tempquat = quat_exports.create();
var tempquat2 = quat_exports.create();
var tempVec33 = vec3_exports.create();
var OrbitalCamera = class extends Component {
  mouseButtonIndex = 0;
  radial = 5;
  minElevation = 0;
  maxElevation = 89.99;
  minZoom = 0.01;
  maxZoom = 10;
  xSensitivity = 0.5;
  ySensitivity = 0.5;
  zoomSensitivity = 0.02;
  damping = 0.9;
  _mouseDown = false;
  _origin = [0, 0, 0];
  _azimuth = 0;
  _polar = 45;
  _initialPinchDistance = 0;
  _touchStartX = 0;
  _touchStartY = 0;
  _azimuthSpeed = 0;
  _polarSpeed = 0;
  init() {
    this.object.getPositionWorld(this._origin);
  }
  start() {
    this._updateCamera();
  }
  onActivate() {
    const canvas2 = this.engine.canvas;
    if (this.mouseButtonIndex === 2) {
      canvas2.addEventListener("contextmenu", preventDefault2, { passive: false });
    }
    canvas2.addEventListener("mousedown", this._onMouseDown);
    canvas2.addEventListener("wheel", this._onMouseScroll, { passive: false });
    canvas2.addEventListener("touchstart", this._onTouchStart, { passive: false });
    canvas2.addEventListener("touchmove", this._onTouchMove, { passive: false });
    canvas2.addEventListener("touchend", this._onTouchEnd);
  }
  onDeactivate() {
    const canvas2 = this.engine.canvas;
    if (this.mouseButtonIndex === 2) {
      canvas2.removeEventListener("contextmenu", preventDefault2);
    }
    canvas2.removeEventListener("mousemove", this._onMouseMove);
    canvas2.removeEventListener("mousedown", this._onMouseDown);
    canvas2.removeEventListener("wheel", this._onMouseScroll);
    canvas2.removeEventListener("touchstart", this._onTouchStart);
    canvas2.removeEventListener("touchmove", this._onTouchMove);
    canvas2.removeEventListener("touchend", this._onTouchEnd);
    this._mouseDown = false;
    this._initialPinchDistance = 0;
    this._touchStartX = 0;
    this._touchStartY = 0;
    this._azimuthSpeed = 0;
    this._polarSpeed = 0;
  }
  update() {
    this._azimuthSpeed *= this.damping;
    this._polarSpeed *= this.damping;
    if (Math.abs(this._azimuthSpeed) < 0.01)
      this._azimuthSpeed = 0;
    if (Math.abs(this._polarSpeed) < 0.01)
      this._polarSpeed = 0;
    this._azimuth += this._azimuthSpeed;
    this._polar += this._polarSpeed;
    this._polar = Math.min(this.maxElevation, Math.max(this.minElevation, this._polar));
    if (this._azimuthSpeed !== 0 || this._polarSpeed !== 0) {
      this._updateCamera();
    }
  }
  /**
   * Get the closest position to the given position on the orbit sphere of the camera.
   * This can be used to get a position and rotation to transition to.
   *
   * You pass this a position object. The method calculates the closest positition and updates the position parameter.
   * It also sets the rotation parameter to reflect the rotate the camera will have when it is on the orbit sphere,
   * pointing towards the center.
   * @param position the position to get the closest position to
   * @param rotation the rotation to get the closest position to
   */
  getClosestPosition(position, rotation) {
    this.object.getRotationWorld(tempquat);
    this.object.lookAt(this._origin);
    this.object.getRotationWorld(tempquat2);
    if (quat_exports.dot(tempquat, tempquat2) < 0) {
      quat_exports.scale(tempquat2, tempquat2, -1);
    }
    this.object.setRotationWorld(tempquat);
    const directionToCamera = vec3_exports.create();
    vec3_exports.subtract(directionToCamera, position, this._origin);
    vec3_exports.normalize(directionToCamera, directionToCamera);
    const nearestPointOnSphere = vec3_exports.create();
    vec3_exports.scale(nearestPointOnSphere, directionToCamera, this.radial);
    vec3_exports.add(nearestPointOnSphere, nearestPointOnSphere, this._origin);
    vec3_exports.copy(position, nearestPointOnSphere);
    quat_exports.copy(rotation, tempquat2);
  }
  /**
   * Set the camera position based on the given position and calculate the rotation.
   * @param cameraPosition the position to set the camera to
   */
  setPosition(cameraPosition) {
    const centerOfOrbit = this._origin;
    vec3_exports.subtract(tempVec33, cameraPosition, centerOfOrbit);
    vec3_exports.normalize(tempVec33, tempVec33);
    const azimuth = Math.atan2(tempVec33[0], tempVec33[2]);
    const polar = Math.acos(tempVec33[1]);
    const azimuthDeg = rad2deg(azimuth);
    const polarDeg = 90 - rad2deg(polar);
    this._azimuth = azimuthDeg;
    this._polar = polarDeg;
  }
  /**
   * Update the camera position based on the current azimuth,
   * polar and radial values
   */
  _updateCamera() {
    const azimuthInRadians = deg2rad(this._azimuth);
    const polarInRadians = deg2rad(this._polar);
    tempVec4[0] = this.radial * Math.sin(azimuthInRadians) * Math.cos(polarInRadians);
    tempVec4[1] = this.radial * Math.sin(polarInRadians);
    tempVec4[2] = this.radial * Math.cos(azimuthInRadians) * Math.cos(polarInRadians);
    this.object.setPositionWorld(tempVec4);
    this.object.translateWorld(this._origin);
    this.object.lookAt(this._origin);
  }
  /* Mouse Event Handlers */
  _onMouseDown = (e) => {
    window.addEventListener("mouseup", this._onMouseUp);
    window.addEventListener("mousemove", this._onMouseMove);
    if (e.button === this.mouseButtonIndex) {
      this._mouseDown = true;
      document.body.style.cursor = "grabbing";
      if (e.button === 1) {
        e.preventDefault();
        return false;
      }
    }
  };
  _onMouseUp = (e) => {
    window.removeEventListener("mouseup", this._onMouseUp);
    window.removeEventListener("mousemove", this._onMouseMove);
    if (e.button === this.mouseButtonIndex) {
      this._mouseDown = false;
      document.body.style.cursor = "initial";
    }
  };
  _onMouseMove = (e) => {
    if (this.active && this._mouseDown) {
      if (this.active && this._mouseDown) {
        this._azimuthSpeed = -(e.movementX * this.xSensitivity);
        this._polarSpeed = e.movementY * this.ySensitivity;
      }
    }
  };
  _onMouseScroll = (e) => {
    e.preventDefault();
    this.radial *= 1 - e.deltaY * this.zoomSensitivity * -1e-3;
    this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
    this._updateCamera();
  };
  /* Touch event handlers */
  _onTouchStart = (e) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      this._touchStartX = e.touches[0].clientX;
      this._touchStartY = e.touches[0].clientY;
      this._mouseDown = true;
    } else if (e.touches.length === 2) {
      this._initialPinchDistance = this._getDistanceBetweenTouches(e.touches);
      e.preventDefault();
    }
  };
  _onTouchMove = (e) => {
    if (!this.active || !this._mouseDown) {
      return;
    }
    e.preventDefault();
    if (e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - this._touchStartX;
      const deltaY = e.touches[0].clientY - this._touchStartY;
      this._azimuthSpeed = -(deltaX * this.xSensitivity);
      this._polarSpeed = deltaY * this.ySensitivity;
      this._touchStartX = e.touches[0].clientX;
      this._touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const currentPinchDistance = this._getDistanceBetweenTouches(e.touches);
      const pinchScale = this._initialPinchDistance / currentPinchDistance;
      this.radial *= pinchScale;
      this.radial = Math.min(this.maxZoom, Math.max(this.minZoom, this.radial));
      this._updateCamera();
      this._initialPinchDistance = currentPinchDistance;
    }
  };
  _onTouchEnd = (e) => {
    if (e.touches.length < 2) {
      this._mouseDown = false;
    }
    if (e.touches.length === 1) {
      this._touchStartX = e.touches[0].clientX;
      this._touchStartY = e.touches[0].clientY;
    }
  };
  /**
   * Helper function to calculate the distance between two touch points
   * @param touches list of touch points
   * @returns distance between the two touch points
   */
  _getDistanceBetweenTouches(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
};
__publicField(OrbitalCamera, "TypeName", "orbital-camera");
__decorate12([
  property.int()
], OrbitalCamera.prototype, "mouseButtonIndex", void 0);
__decorate12([
  property.float(5)
], OrbitalCamera.prototype, "radial", void 0);
__decorate12([
  property.float()
], OrbitalCamera.prototype, "minElevation", void 0);
__decorate12([
  property.float(89.99)
], OrbitalCamera.prototype, "maxElevation", void 0);
__decorate12([
  property.float()
], OrbitalCamera.prototype, "minZoom", void 0);
__decorate12([
  property.float(10)
], OrbitalCamera.prototype, "maxZoom", void 0);
__decorate12([
  property.float(0.5)
], OrbitalCamera.prototype, "xSensitivity", void 0);
__decorate12([
  property.float(0.5)
], OrbitalCamera.prototype, "ySensitivity", void 0);
__decorate12([
  property.float(0.02)
], OrbitalCamera.prototype, "zoomSensitivity", void 0);
__decorate12([
  property.float(0.9)
], OrbitalCamera.prototype, "damping", void 0);

// js/colyseus-client.js
var import_colyseus = __toESM(require_lib(), 1);
var ColyseusClient = class extends Component {
  init() {
    this.client = new import_colyseus.Client("ws://localhost:2567");
    document.client = this.client;
    this.hostButton.addEventListener("click", this.onHostClick.bind(this));
    this.joinButton.addEventListener("click", this.onJoinClick.bind(this));
    this.leaveButton.addEventListener("click", this.onLeaveClick.bind(this));
  }
  onHostClick() {
    this.client.create("my_room").then(
      function(room) {
        this.setupRoom(room);
        console.log(room.sessionId, "created", room.name);
      }.bind(this)
    ).catch(function(e) {
      console.log("CREATE ERROR", e);
    });
  }
  onJoinClick() {
    this.client.join("my_room").then(
      function(room) {
        this.setupRoom(room);
        console.log(room.sessionId, "joined", room.name);
      }.bind(this)
    ).catch(function(e) {
      console.log("JOIN ERROR", e);
    });
  }
  onLeaveClick() {
    if (this.room) {
      this.room.leave().then(
        function() {
          console.log("Left the room", this.room.name);
          this.room = null;
        }.bind(this)
      ).catch(function(e) {
        console.log("LEAVE ERROR", e);
      });
    } else {
      console.log("No room to leave");
    }
  }
  setupRoom(room) {
    this.room = room;
    this.newPosBox = {};
    this.newPosCone = {};
    this.newPosSphere = {};
    room.state.box.onChange(() => {
      this.box.setTranslationWorld([this.room.state.box.x, this.room.state.box.y, this.room.state.box.z]);
    });
    room.state.cone.onChange(() => {
      this.cone.setTranslationWorld([this.room.state.cone.x, this.room.state.cone.y, this.room.state.cone.z]);
    });
    room.state.sphere.onChange(() => {
      this.sphere.setTranslationWorld([this.room.state.sphere.x, this.room.state.sphere.y, this.room.state.sphere.z]);
    });
  }
};
__publicField(ColyseusClient, "TypeName", "colyseus-client");
__publicField(ColyseusClient, "Properties", {
  sphere: { type: Type.Object },
  box: { type: Type.Object },
  cone: { type: Type.Object },
  hostButton: { type: Type.Object },
  joinButton: { type: Type.Object },
  leaveButton: { type: Type.Object }
});

// js/buttonCreate.js
function hapticFeedback(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators)
      gamepad.hapticActuators[0].pulse(strength, duration);
  }
}
var ButtonComponent = class extends Component {
  static onRegister(engine2) {
    engine2.registerComponent(HowlerAudioSource);
    engine2.registerComponent(CursorTarget);
  }
  returnPos = new Float32Array(3);
  start() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);
    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/click.wav",
      spatial: true
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/unclick.wav",
      spatial: true
    });
  }
  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onUp.add(this.onUp);
  }
  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    this.target.onUp.remove(this.onUp);
  }
  onHover = (_, cursor) => {
    this.mesh.material = this.hoverMaterial;
    if (cursor.type === "finger-cursor") {
      this.onDown(_, cursor);
    }
    hapticFeedback(cursor.object, 0.5, 50);
  };
  onDown = (_, cursor) => {
    console.log("Button pressed");
    this.soundClick.play();
    this.buttonMeshObject.translate([0, -0.1, 0]);
    hapticFeedback(cursor.object, 1, 20);
    let colyseusClient = this.object.getComponent(ColyseusClient);
    if (!colyseusClient) {
      colyseusClient = this.object.parent.getComponent(ColyseusClient);
    }
    if (colyseusClient) {
      colyseusClient.onHostClick();
    } else {
      console.error("ColyseusClient component not found!");
    }
  };
  onUp = (_, cursor) => {
    this.soundUnClick.play();
    this.buttonMeshObject.setTranslationLocal(this.returnPos);
    hapticFeedback(cursor.object, 0.7, 20);
  };
  onUnhover = (_, cursor) => {
    this.mesh.material = this.defaultMaterial;
    if (cursor.type === "finger-cursor") {
      this.onUp(_, cursor);
    }
    hapticFeedback(cursor.object, 0.3, 50);
  };
};
__publicField(ButtonComponent, "TypeName", "buttonCreate");
__publicField(ButtonComponent, "Properties", {
  buttonMeshObject: Property.object(),
  hoverMaterial: Property.material()
});

// js/buttonJoin.js
function hapticFeedback2(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators)
      gamepad.hapticActuators[0].pulse(strength, duration);
  }
}
var ButtonComponent2 = class extends Component {
  static onRegister(engine2) {
    engine2.registerComponent(HowlerAudioSource);
    engine2.registerComponent(CursorTarget);
  }
  returnPos = new Float32Array(3);
  start() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);
    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/click.wav",
      spatial: true
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/unclick.wav",
      spatial: true
    });
  }
  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onUp.add(this.onUp);
  }
  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    this.target.onUp.remove(this.onUp);
  }
  onHover = (_, cursor) => {
    this.mesh.material = this.hoverMaterial;
    if (cursor.type === "finger-cursor") {
      this.onDown(_, cursor);
    }
    hapticFeedback2(cursor.object, 0.5, 50);
  };
  onDown = (_, cursor) => {
    console.log("Button pressed");
    this.soundClick.play();
    this.buttonMeshObject.translate([0, -0.1, 0]);
    hapticFeedback2(cursor.object, 1, 20);
    let colyseusClient = this.object.getComponent(ColyseusClient);
    if (!colyseusClient) {
      colyseusClient = this.object.parent.getComponent(ColyseusClient);
    }
    if (colyseusClient) {
      colyseusClient.onJoinClick();
    } else {
      console.error("ColyseusClient component not found!");
    }
  };
  onUp = (_, cursor) => {
    this.soundUnClick.play();
    this.buttonMeshObject.setTranslationLocal(this.returnPos);
    hapticFeedback2(cursor.object, 0.7, 20);
  };
  onUnhover = (_, cursor) => {
    this.mesh.material = this.defaultMaterial;
    if (cursor.type === "finger-cursor") {
      this.onUp(_, cursor);
    }
    hapticFeedback2(cursor.object, 0.3, 50);
  };
};
__publicField(ButtonComponent2, "TypeName", "buttonJoin");
__publicField(ButtonComponent2, "Properties", {
  buttonMeshObject: Property.object(),
  hoverMaterial: Property.material()
});

// js/buttonLeave.js
function hapticFeedback3(object, strength, duration) {
  const input = object.getComponent(InputComponent);
  if (input && input.xrInputSource) {
    const gamepad = input.xrInputSource.gamepad;
    if (gamepad && gamepad.hapticActuators)
      gamepad.hapticActuators[0].pulse(strength, duration);
  }
}
var ButtonComponent3 = class extends Component {
  static onRegister(engine2) {
    engine2.registerComponent(HowlerAudioSource);
    engine2.registerComponent(CursorTarget);
  }
  returnPos = new Float32Array(3);
  start() {
    this.mesh = this.buttonMeshObject.getComponent(MeshComponent);
    this.defaultMaterial = this.mesh.material;
    this.buttonMeshObject.getTranslationLocal(this.returnPos);
    this.target = this.object.getComponent(CursorTarget) || this.object.addComponent(CursorTarget);
    this.soundClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/click.wav",
      spatial: true
    });
    this.soundUnClick = this.object.addComponent(HowlerAudioSource, {
      src: "sfx/unclick.wav",
      spatial: true
    });
  }
  onActivate() {
    this.target.onHover.add(this.onHover);
    this.target.onUnhover.add(this.onUnhover);
    this.target.onDown.add(this.onDown);
    this.target.onUp.add(this.onUp);
  }
  onDeactivate() {
    this.target.onHover.remove(this.onHover);
    this.target.onUnhover.remove(this.onUnhover);
    this.target.onDown.remove(this.onDown);
    this.target.onUp.remove(this.onUp);
  }
  onHover = (_, cursor) => {
    this.mesh.material = this.hoverMaterial;
    if (cursor.type === "finger-cursor") {
      this.onDown(_, cursor);
    }
    hapticFeedback3(cursor.object, 0.5, 50);
  };
  onDown = (_, cursor) => {
    console.log("Button pressed");
    this.soundClick.play();
    this.buttonMeshObject.translate([0, -0.1, 0]);
    hapticFeedback3(cursor.object, 1, 20);
    let colyseusClient = this.object.getComponent(ColyseusClient);
    if (!colyseusClient) {
      colyseusClient = this.object.parent.getComponent(ColyseusClient);
    }
    if (colyseusClient) {
      colyseusClient.onLeaveClick();
    } else {
      console.error("ColyseusClient component not found!");
    }
  };
  onUp = (_, cursor) => {
    this.soundUnClick.play();
    this.buttonMeshObject.setTranslationLocal(this.returnPos);
    hapticFeedback3(cursor.object, 0.7, 20);
  };
  onUnhover = (_, cursor) => {
    this.mesh.material = this.defaultMaterial;
    if (cursor.type === "finger-cursor") {
      this.onUp(_, cursor);
    }
    hapticFeedback3(cursor.object, 0.3, 50);
  };
};
__publicField(ButtonComponent3, "TypeName", "buttonLeave");
__publicField(ButtonComponent3, "Properties", {
  buttonMeshObject: Property.object(),
  hoverMaterial: Property.material()
});

// js/network-controller.js
var NetworkController = class extends Component {
  start() {
    document.addEventListener("keypress", this.onKeyPress.bind(this));
    this.currentObject = "box";
    this.colyseusComponent = this.colyseusObject.getComponent("colyseus-client", 0);
    this.networkArray = [0, 0, 0];
    this.up = false;
    this.right = false;
    this.down = false;
    this.left = false;
    window.addEventListener("keydown", this.press.bind(this));
    window.addEventListener("keyup", this.release.bind(this));
  }
  onKeyPress(e) {
    const boxControls = this.box ? this.box.getComponent("wasd-controls", 0) : null;
    const coneControls = this.cone ? this.cone.getComponent("wasd-controls", 0) : null;
    const sphereControls = this.sphere ? this.sphere.getComponent("wasd-controls", 0) : null;
    switch (e.code) {
      case "KeyB":
        if (boxControls)
          boxControls.active = true;
        if (coneControls)
          coneControls.active = false;
        if (sphereControls)
          sphereControls.active = false;
        this.currentObject = "box";
        break;
      case "KeyN":
        if (boxControls)
          boxControls.active = false;
        if (coneControls)
          coneControls.active = false;
        if (sphereControls)
          sphereControls.active = true;
        this.currentObject = "sphere";
        break;
      case "KeyM":
        if (boxControls)
          boxControls.active = false;
        if (coneControls)
          coneControls.active = true;
        if (sphereControls)
          sphereControls.active = false;
        this.currentObject = "cone";
        break;
      case "KeyA":
      case "KeyS":
      case "KeyW":
      case "KeyD":
        this.moved = true;
        break;
    }
  }
  update(dt) {
    if (this.colyseusComponent && this.colyseusComponent.room) {
      this.networkArray = [0, 0, 0];
      if (this.up)
        this.networkArray[2] -= 1;
      if (this.down)
        this.networkArray[2] += 1;
      if (this.left)
        this.networkArray[0] -= 1;
      if (this.right)
        this.networkArray[0] += 1;
      this.networkArray[0] *= this.speed;
      this.networkArray[2] *= this.speed;
      if (this.networkArray.x != 0 && this.networkArray.z != 0)
        this.colyseusComponent.room.send("move", {
          object: this.currentObject,
          x: this.networkArray[0],
          z: this.networkArray[2]
        });
    }
  }
  press(e) {
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
      this.up = true;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      this.right = true;
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      this.down = true;
    } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
      this.left = true;
    }
  }
  release(e) {
    if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
      this.up = false;
    } else if (e.keyCode === 39 || e.keyCode === 68) {
      this.right = false;
    } else if (e.keyCode === 40 || e.keyCode === 83) {
      this.down = false;
    } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
      this.left = false;
    }
  }
};
__publicField(NetworkController, "TypeName", "network-controller");
__publicField(NetworkController, "Properties", {
  sphere: { type: Type.Object },
  box: { type: Type.Object },
  cone: { type: Type.Object },
  colyseusObject: { type: Type.Object },
  speed: { type: Type.Float, default: 0.1 }
});

// js/index.js
var Constants = {
  ProjectName: "Colyseus",
  RuntimeBaseName: "WonderlandRuntime",
  WebXRRequiredFeatures: ["local"],
  WebXROptionalFeatures: ["local", "local-floor", "hand-tracking", "hit-test"]
};
var RuntimeOptions = {
  physx: false,
  loader: false,
  xrFramebufferScaleFactor: 1,
  xrOfferSession: {
    mode: "auto",
    features: Constants.WebXRRequiredFeatures,
    optionalFeatures: Constants.WebXROptionalFeatures
  },
  canvas: "canvas"
};
var engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
engine.onLoadingScreenEnd.once(() => {
  const el = document.getElementById("version");
  if (el)
    setTimeout(() => el.remove(), 2e3);
});
function requestSession(mode) {
  engine.requestXRSession(mode, Constants.WebXRRequiredFeatures, Constants.WebXROptionalFeatures).catch((e) => console.error(e));
}
function setupButtonsXR() {
  const arButton = document.getElementById("ar-button");
  if (arButton) {
    arButton.dataset.supported = engine.arSupported;
    arButton.addEventListener("click", () => requestSession("immersive-ar"));
  }
  const vrButton = document.getElementById("vr-button");
  if (vrButton) {
    vrButton.dataset.supported = engine.vrSupported;
    vrButton.addEventListener("click", () => requestSession("immersive-vr"));
  }
}
if (document.readyState === "loading") {
  window.addEventListener("load", setupButtonsXR);
} else {
  setupButtonsXR();
}
engine.registerComponent(Cursor);
engine.registerComponent(CursorTarget);
engine.registerComponent(FingerCursor);
engine.registerComponent(HandTracking);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(TeleportComponent);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(ButtonComponent);
engine.registerComponent(ButtonComponent2);
engine.registerComponent(ButtonComponent3);
engine.registerComponent(ColyseusClient);
engine.registerComponent(NetworkController);
try {
  await engine.loadMainScene(`${Constants.ProjectName}.bin`);
} catch (e) {
  console.error(e);
  window.alert(`Failed to load ${Constants.ProjectName}.bin:`, e);
}
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
//# sourceMappingURL=Colyseus-bundle.js.map
