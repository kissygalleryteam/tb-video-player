/**
 * @fileoverview 
 * @author 岳松<yuesong.xys@taobao.com>
 * @module tb-video-player
 **/
KISSY.add(function (S, Node, Base, DOM, SWF, UA) {

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
            container: 'body', //目前仅支持KISSY支持的选择器
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

    var _swf,
        _guid = S.guid('TbVideoPlayer-');

    //获取当前平台（pc或mobile，设备类型，用于生成不同的视频地址）
    function _getPlatform () {

        var _PLATFORM = {};
        if (UA.mobile) {
            _PLATFORM.isPC = false;
            _PLATFORM.isMobile = true;
            switch (UA.os){
                case 'ios' :
                    _PLATFORM.equipmentType = UA.ipad ? 2 : 3;
                    break;
                case 'android' :
                    _PLATFORM.equipmentType = UA.android < 3.0 ? 6 : 5;
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

    //根据配置，生成视频地址
    function _getVideoUrl (config) {

        var _exp = new RegExp(/\d+$/i);
        if (!_exp.test(config.vid)) {
            S.log(config.vid + 'is illegal!');
            return;
        }

        var _video_url = '';
        _video_url += 'http://cloud.video.';
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

    //将配置内的部分播放器参数设置到flashvars里面
    function _setFlashvars (config) {

        config.flashvars.autoplay = config.isAutoPlay;
        config.flashvars.poster = config.poster;
        if (!config.showloadinglogo) {
            config.flashvars.reservelt = 9527;
        }
        config.flashvars.show_controlbar_logo = config.showlogobtn;
        config.flashvars.show_fullscreen_button = config.showfullscreenbtn;
        config.flashvars.show_share_button = config.showsharebutton;

    }

    //渲染视频到相应的节点
    function _rendVideoNode (src, VideoConfig, CallBack) {

        _setFlashvars(VideoConfig);
        var _container = typeof VideoConfig.container === 'string' ? DOM.get(VideoConfig.container) : VideoConfig.container;

        if (PLATFORM.isPC) {
            _swf = new SWF({
                src: src,
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
        } else if (PLATFORM.isMobile) {
            var _video_node = DOM.create('<video>', {
                width: VideoConfig.width,
                height: VideoConfig.height,
                controls: 'controls',
                src: src,
                id: _guid
            });
            if (VideoConfig.poster) {
                DOM.attr(_video_node, 'poster', VideoConfig.poster);
            }
            if (VideoConfig.isAutoPlay) {
                DOM.attr(_video_node, 'autoplay', 'autoplay');
            }
            DOM.append(_video_node, _container);
        } else {
            S.log('Neither PC or Mobile, tell me what to do...');
            return;
        }
        if (typeof CallBack === 'function') {
            CallBack(DOM.get('#' + _guid));
        }

    }

    //销毁视频节点
    function _destroy () {

        if (PLATFORM.isPC) {
            _swf && _swf.destroy();
        } else if (PLATFORM.isMobile) {
            $('#' + _guid).detach().remove();
        } else {
            return;
        }
        _guid = S.guid('TbVideoPlayer-'); //重新生成guid
        _swf = undefined;

    }

    /**
     * 
     * @class TbVideoPlayer
     * @constructor
     * @extends Base
     */
    function TbVideoPlayer(VideoConfig, CallBack) {

        var self = this;
        //调用父类构造函数
        TbVideoPlayer.superclass.constructor.call(self, VideoConfig, CallBack);
        var _VideoConfig = S.merge(VIDEOCONFIG, VideoConfig);
        var _video_url = _getVideoUrl(_VideoConfig);
        _rendVideoNode(_video_url, _VideoConfig, CallBack);

    }

    S.extend(TbVideoPlayer, Base, /** @lends TbVideoPlayer.prototype*/{
        destory: function () {
            _destroy();
        }
    }, {ATTRS : /** @lends TbVideoPlayer*/{
        
    }});

    return TbVideoPlayer;

}, {requires:['node', 'base', 'dom', KISSY.version < '1.30' ? './core/swf' : 'swf', 'ua']});

