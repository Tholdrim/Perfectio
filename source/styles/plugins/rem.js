registerPlugin({
    install: function(less, pluginManager, functions) {
        functions.add('rem', function(size) {
            if (size.unit.is("px")) {
                return new tree.Dimension(size.value / 16, 'rem');
            }
        });
    }
})
