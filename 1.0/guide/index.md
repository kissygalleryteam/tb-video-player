## 综述

TbVideoPlayer是。

* 版本：1.0
* 作者：岳松
* demo：[http://gallery.kissyui.com/tb-video-player/1.0/demo/index.html](http://gallery.kissyui.com/tb-video-player/1.0/demo/index.html)

## 初始化组件

    S.use('gallery/tb-video-player/1.0/index', function (S, TbVideoPlayer) {
         var tb_video_player = new TbVideoPlayer();
    })

## API说明

### Configs Detail

1. `vid` (Number)
必填，视频的id，在<http://ugc.taobao.com/>能查到（在复制代码中查看）

2. `uid` (Number, default=727053408)
选填，视频上传者的id，无需特殊指定，如有特殊需求，也可在上面地址内查到

3. `tid` (Number, default=1)
选填，视频播放器的皮肤id，无需特殊指定，如有特殊需求，联系**雷刚**定制皮肤

4. `isAutoPlay` (Boolean, default=false)
选填，是否自动播放视频，IOS系列和部分Android设置无效，PC正常

5. `width` (String, default=100%)
选填，视频播放器宽度，须自带单位

6. `height` (String, default=100%)
选填，视频播放器高度，须自带单位

7. `isDaily` (Boolean, default=false)
选填，指定当前环境是否为日常

8. `container` (String, default=body)
选填，播放器插入的容器，默认为`body`

9. `allowScriptAccess` (String, default=always)
选填，播放器是否允许和js交互，可填`always`, `*.taobao.com`, `never`

10. `wmode` (String, default=transparent)
选填，窗口显示模式，可填`window`, `direct`, `opaque`, `transparent`, `gpu`

11. `flashvars` (Object, default={})
选填，flash参数，传入flash播放器

12. `showloadinglogo` (Boolean, default=true)
选填，播放器参数，是否显示loading时的logo。默认是true

13. `showlogobtn` (Boolean, default=false)
选填，播放器参数，是否显示控制条上的Logo按钮，默认为false

14. `showfullscreenbtn` (Boolean, default=true)
选填，播放器参数，是否显示全屏按钮，默认为true

15. `showsharebutton` (Boolean, default=true)
选填，播放器参数，是否显示分享按钮，默认为true

### Methods

1. `destroy()`

销毁淘宝视频播放器