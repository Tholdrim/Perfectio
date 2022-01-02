var Perfectio;
(function (Perfectio) {
    var Menu = /** @class */ (function () {
        function Menu() {
            var _this = this;
            this.$document = $(document);
            this.$window = $(window);
            this.sections = this.initializeSections();
            this.$document.on('scroll', function () { return _this.handleScroll(); });
            this.$document.on('click', 'header a[href^="#"]', function (event) { return _this.handleMenuItemClick(event); });
            this.$document.scroll();
        }
        Menu.prototype.createSection = function (element) {
            var $element = $(element);
            return {
                $element: $element,
                $menuItem: $("a[href='#" + element.id + "']"),
                position: $element.position().top
            };
        };
        Menu.prototype.getCurrentSection = function (currentPosition) {
            var _this = this;
            var callback = function (previousValue, currentValue) {
                return currentPosition - currentValue.position >= 0
                    ? (previousValue === undefined || currentValue.position > previousValue.position ? currentValue : previousValue)
                    : previousValue;
            };
            return Object.keys(this.sections).map(function (hash) { return _this.sections[hash]; }).reduce(callback, undefined);
        };
        Menu.prototype.initializeSections = function () {
            var _this = this;
            var result = {};
            $('section[id]').each(function (_, element) {
                result["#" + element.id] = _this.createSection(element);
            });
            return result;
        };
        Menu.prototype.updateSections = function (newCurrentSection) {
            if (newCurrentSection !== this.currentSection) {
                if (this.currentSection !== undefined)
                    this.currentSection.$menuItem.removeClass('current');
                if (newCurrentSection !== undefined)
                    newCurrentSection.$menuItem.addClass('current');
                this.currentSection = newCurrentSection;
            }
        };
        Menu.prototype.handleMenuItemClick = function (event) {
            var _this = this;
            event.preventDefault();
            var targetHash = $(event.target).attr('href');
            var newCurrentSection = this.sections[targetHash];
            if (newCurrentSection !== undefined) {
                this.$document.off('scroll');
                this.updateSections(newCurrentSection);
                var animationProperties = {
                    scrollTop: newCurrentSection.position
                };
                $('html, body').animate(animationProperties, 500, function () {
                    newCurrentSection.$menuItem.blur();
                    _this.$document.on('scroll', function () { return _this.handleScroll(); });
                });
            }
        };
        Menu.prototype.handleScroll = function () {
            var currentPosition = this.$window.scrollTop();
            var newCurrentSection = this.getCurrentSection(currentPosition);
            this.updateSections(newCurrentSection);
        };
        return Menu;
    }());
    $(function () { return new Menu(); });
})(Perfectio || (Perfectio = {}));
