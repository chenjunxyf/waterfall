$(function() {
    var $container = $('.tt-waterfall'),
        containerWidth = 1860,
        baseHeight = 238,
        baseMargin = 10;


    $.ajax({
        url: '/imgList/index/',
        method: 'GET',
        data: {},
        success: function(data) {
            renderGroup(data);
        },
        error: function() {

        }
    });


    function renderGroup(data) {
        var list = data.list || [],
            rowItems = [],
            currentWidth = 0;

        var $group = $('<div></div>').addClass('wf-group');            

        for (var i = 0; i < list.length; i++) {
            var item = list[i],
                cpWidth = Math.floor(baseHeight * (item.width / item.height)),
                allWidth = 0;

            currentWidth += cpWidth;

            var liTmp = getTemplateLi({
                    link: item.link,
                    thumb: item.thumb,
                    width: cpWidth,
                    height: baseHeight
                });
            rowItems.push(liTmp);

            allWidth = currentWidth + baseMargin * (rowItems.length - 1);

            if (allWidth >= containerWidth) {
                var $row = $('<div></div>').addClass('wf-row');

                clipImgs(rowItems, allWidth - containerWidth);

                $row.append(rowItems.join(''));
                $group.append($row);
                $container.append($group);
                
                rowItems = [];
                currentWidth = 0;
            }
        }
    }

    // 获取基本标签
    function getTemplateLi(opts) {
        var compiled =  _.template('<li style="width: <%=width %>px; height: <%=height %>px"><a class="img-box" href="<%=link %>"><img src="<%=thumb %>" style="width: <%=width %>px; height: <%=height %>px"></a></li>', opts);
        return compiled(opts);
    }
    // 图片裁剪
    function clipImgs(rowItems, extraWidth) {
        if (extraWidth === 0) return;

        var clipWidth = Math.floor(extraWidth / rowItems.length / 2);
        var tmpWidth = 0;

        for (var i = 0; i < rowItems.length; i++) {
            var $item = $($.parseHTML(rowItems[i])),
                actualWidth = $item.width() - clipWidth * 2,
                rest = 0;

            tmpWidth += actualWidth;
            $item.css('width', actualWidth);
            $item.find('img').css('margin-left', -clipWidth);
            
            if (i === rowItems.length - 1) {
                $item.css('margin-right', 0);
                rest = tmpWidth + (rowItems.length - 1)*baseMargin - containerWidth;
                $item.css('width', $item.width() - rest);
                $item.find('img').css('margin-left', -clipWidth - Math.floor(rest/2));
            }
            rowItems[i] = $item.prop('outerHTML');
        }
    }
});








