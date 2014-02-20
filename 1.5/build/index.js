/*
combined files : 

gallery/tb-video-player/1.5/index

*/
/**
 * @fileoverview 
 * @author 岳松<yuesong.xys@taobao.com>
 * @module tb-video-player
 **/
KISSY.add('gallery/tb-video-player/1.5/index',function (S, Node, Base, DOM, SWF) {

    var EMPTY = '',
        $ = Node.all,
        PLATFORM = _getPlatform(),
        VIDEOCONFIG = {
            vid: EMPTY,
            uid: '727053408',
            tid: '1',
            isAutoPlay: false,
            width: '100%',
            height: '100%',
            isDaily: false,
            container: 'body',
            allowScriptAccess: 'always',
            wmode: 'transparent',
            allowFullScreen: true,
            poster: EMPTY,
            flashvars: {},
            showloadinglogo: true,
            showlogobtn: false,
            showfullscreenbtn: true,
            showsharebutton: true
        };

    // 获取当前平台（pc或mobile，设备类型，用于生成不同的视频地址）
    function _getPlatform() {

        var _PLATFORM = {};
        if (S.UA.mobile) {
            _PLATFORM.isPC = false;
            _PLATFORM.isMobile = true;
            switch (S.UA.os){
                case 'ios' :
                    _PLATFORM.equipmentType = S.UA.ipad ? 2 : 3;
                    break;
                case 'android' :
                    _PLATFORM.equipmentType = S.UA.android < 3.0 ? 6 : 5;
                    break;
                default:
                    _PLATFORM.equipmentType = 6; //预留给windows phone, 待测试
                    break;
            }
        } else {
            _PLATFORM.isPC = true;
            _PLATFORM.isMobile = false;
            _PLATFORM.equipmentType = 1;
        }
        return _PLATFORM;

    }

    // 根据配置，生成视频地址
    function _getVideoUrl(config) {

        var _exp = new RegExp(/\d+$/i);
        if (!_exp.test(config.vid)) {
            S.log(config.vid + 'is illegal!');
            return;
        }

        var _video_url = 'http://cloud.video.';
        _video_url += config.isDaily ? 'daily.taobao.net' : 'taobao.com';
        _video_url += '/play/u/';
        _video_url += config.uid + '/p/';
        _video_url += (config.isAutoPlay ? 1 : 2) + '/e/';
        _video_url += PLATFORM.equipmentType + '/t/';
        _video_url += config.tid + '/';
        _video_url += config.vid + '.';
        _video_url += PLATFORM.equipmentType === 1 ? 'swf' : (S.inArray(PLATFORM.equipmentType, [2, 3, 5]) ? 'm3u8' : 'mp4');
        return _video_url;

    }

    // 将配置内的部分播放器参数设置到flashvars里面
    function _setFlashvars(playerId, config) {

        config.flashvars.autoplay = config.isAutoPlay;
        config.flashvars.poster = config.poster;
        if (!config.showloadinglogo) {
            config.flashvars.reservelt = 9527;
        }
        config.flashvars.show_controlbar_logo = config.showlogobtn;
        config.flashvars.show_fullscreen_button = config.showfullscreenbtn;
        config.flashvars.show_share_button = config.showsharebutton;
        config.flashvars.playerid = playerId;

    }

    /**
     * 
     * @class TbVideoPlayer
     * @constructor
     * @extends Base
     */
    function TbVideoPlayer(VideoConfig, CallBack) {

        var self = this;
        // 调用父类构造函数
        TbVideoPlayer.superclass.constructor.call(self, VideoConfig, CallBack);
        var _VideoConfig = S.merge(VIDEOCONFIG, VideoConfig);
        self._video_url = _getVideoUrl(_VideoConfig);
        self._guid = S.guid('TbVideoPlayer-');
        self._init(_VideoConfig, CallBack);

    }

    S.extend(TbVideoPlayer, Base, /** @lends TbVideoPlayer.prototype*/{

        _init: function(VideoConfig, CallBack){
            var self = this,
                _guid = self._guid;
            //self._guid = S.guid('TbVideoPlayer-');
            _setFlashvars(_guid, VideoConfig);
            var _container = typeof VideoConfig.container === 'string' ? DOM.get(VideoConfig.container) : VideoConfig.container;

            if (PLATFORM.isPC) {
                self._swf = new SWF({
                    src: self._video_url,
                    attrs:{
                        width: VideoConfig.width,
                        height: VideoConfig.height,
                        id: _guid
                    },
                    params:{
                        wmode: VideoConfig.wmode,
                        allowScriptAccess: VideoConfig.allowScriptAccess,
                        allowFullScreen: VideoConfig.allowFullScreen,
                        flashVars: VideoConfig.flashvars
                    },
                    render: _container
                });

                self._destroy = function() {
                    self._swf.destroy();
                }

                self._play = function(){
                    self._swf.callSWF('resume');
                }

                self._pause = function(){
                    self._swf.callSWF('pause');
                }

            } else if (PLATFORM.isMobile) {
                var _video_node = DOM.create('<video>', {
                    width: VideoConfig.width,
                    height: VideoConfig.height,
                    controls: 'controls',
                    src: self._video_url,
                    id: _guid
                });
                if (VideoConfig.poster) {
                    DOM.attr(_video_node, 'poster', VideoConfig.poster);
                }
                if (VideoConfig.isAutoPlay) {
                    DOM.attr(_video_node, 'autoplay', 'autoplay');
                }
                DOM.append(_video_node, _container);

                self._destroy = function() {
                    $('#' + _guid).detach().remove();
                }

                self._play = function(){
                    DOM.get('#' + _guid).play();
                }

                self._pause = function(){
                    DOM.get('#' + _guid).pause();
                }

            } else {
                S.log('Neither PC or Mobile, tell me what to do...');
                return;
            }

            if (typeof CallBack === 'function') {
                CallBack(DOM.get('#' + _guid));
            }
        },
        destory: function(){ // 拼写错误，保留是为了兼容以前版本
            this._destroy();
        },
        destroy: function(){
            this._destroy();
        },
        pause: function(){
            this._pause();
        },
        play: function(){
            this._play();
        }
    }, {ATTRS : /** @lends TbVideoPlayer*/{
        
    }});

    return TbVideoPlayer;

}, {requires:['node', 'base', 'dom', KISSY.version < '1.30' ? '../1.3/core/swf' : 'swf']});


