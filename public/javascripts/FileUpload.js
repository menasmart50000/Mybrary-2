
FilePond.registerPlugin({
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
    FilePondPluginImagePreview

});

FilePond.setOptions({
    styleItemPanelAspectRatio: 150/100,
    imageResizeTargetWidth: 100,
    imageResizeTargetWidth: 150 

})

FilePond.parse(document.body);