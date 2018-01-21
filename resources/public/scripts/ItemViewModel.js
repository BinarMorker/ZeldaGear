function ItemViewModel(data) {

    var self = this;
    self.level = ko.observable(Number(data.level) || 0);
    self.desiredLevel = ko.observable(4);
    self.name = data.name;
    self.icon = data.icon;
    self.set = data.set;
    self.requirements = ko.observableArray([]);
    self.levels = data.levels;

    self.setLevel = function() {
        if (self.level() < 4) {
            self.level(self.level() + 1);
        } else {
            self.level(0);
        }

        self.recomputeRequirements();
    };

    self.setDesiredLevel = function() {
        if (self.desiredLevel() < 4) {
            self.desiredLevel(self.desiredLevel() + 1);
        } else {
            self.desiredLevel(0);
        }

        self.recomputeRequirements();
    };

    self.recomputeRequirements = function() {
        self.requirements([]);

        if (self.level() < self.desiredLevel()) {
            for (var i = self.level(); i < self.desiredLevel(); i++) {
                ko.utils.arrayPushAll(self.requirements, self.levels[i]);
            }
        }
    };

}