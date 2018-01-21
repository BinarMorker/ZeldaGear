function AppViewModel() {

    var self = this;
    self.items = ko.observableArray([]);
    self.requirements = ko.observableArray([]);
    self.desiredLevel = ko.observable(4);
    self.desiredLevel.subscribe(function(value) {
        self.items().forEach(function(item) {
            item.desiredLevel(value);
            item.recomputeRequirements();
        });
        self.recomputeRequirements();
    });

    self.load = function() {
        $.get('/resources/public/assets/items.json', function(data) {
            var existing = getCookie('armor').split(';').map(function(j) {
                var k = j.split(':');
                return { name: k[0], quantity: k[1] };
            });
            self.items(data.map(function(item) {
                var existingItem = existing.filter(function(j) {
                    return j.name === item.name;
                });
                if (existingItem.length > 0) {
                    item.level = existingItem[0].quantity;
                }
                var vm = new ItemViewModel(item);
                vm.recomputeRequirements();
                vm.requirements.subscribe(function() {
                    self.recomputeRequirements();
                    updateStorage();
                });
                return vm;
            }).sort(function(a, b) {
                return (a.set > b.set) ? 1 : ((b.set > a.set) ? -1 : 0);
            }));
            self.recomputeRequirements();
        });
    };

    self.recomputeRequirements = function() {
        self.requirements([]);
        var requirements = [];
        self.items().forEach(function(item) {
            requirements = requirements.concat(item.requirements());
        });
        var names = arrayUnique(requirements.map(function(item) { return item.name; }));
        names.forEach(function(item) {
            var requirement = requirements.filter(function(req) {
                return req.name === item;
            });
            self.requirements.push({ name: item, quantity: requirement.reduce(function(total, value) { return total + value.quantity; }, 0) });
        });
        self.requirements(self.requirements().sort(function(a, b) { return (a.quantity < b.quantity) ? 1 : ((b.quantity < a.quantity) ? -1 : 0); }));
    };

    function updateStorage() {
        setCookie("armor", self.items().reduce(function(total, item) {
            return total + item.name + ':' + item.level() + ';';
        }, ''), 365, '/');
    }

    function setCookie(name, value, days , path) {
        var expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
    }

    function getCookie(name) {
        var cookie = document.cookie.split('; ').reduce(function(r, v) {
            var parts = v.split('=');
            return parts[0] === name ? parts[1] : r
        });
        var parts = cookie.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : cookie;
    }

    function arrayUnique(array) {
        var a = array.concat();

        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    }

    self.load();

}