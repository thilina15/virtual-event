FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize
)

FilePond.setOptions({
    stylePanelAspectRatio: 200/300,
     imageResizeTargetWidth: 300,
    imageResizeTargetHeight: 200,
    
})

FilePond.parse(document.body);