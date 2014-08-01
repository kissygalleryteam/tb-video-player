KISSY.add(function (S, Node,Demo) {
    var $ = Node.all;
    describe('tb-video-player', function () {
        it('Instantiation of components',function(){
            var demo = new Demo();
            expect(S.isObject(demo)).toBe(true);
        })
    });

},{requires:['node','gallery/tb-video-player/1.5/']});