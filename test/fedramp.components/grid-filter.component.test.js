describe('the grid filter component', function () {
    'use strict';

    var component;
    var $componentController;
    var gridFilter;
    var grid;
    var $log;
    var $location;
    var filteredItems;
    var $scope;
    var dataFactory;


    beforeEach(function () {
        module('fedramp', 'fedramp.components');
        inject(function($injector){
            $location = $injector.get('$location');
        });

        dataFactory = new TestDataFactory(inject);
        grid = dataFactory.gridComponent({

            items: filteredItems,
            onUpdate: function(){},
            rawItems: [{
                name: 'Amazon',
                agencies: ['DoD', 'DEA'],
                products: [
                    {
                        name: 'Dog Bone'
                    },
                    {
                        name: 'Treats'
                    }
                ]
            }],
            savedState: true
        });
        grid.$onInit();
    });

    it('should add a new filter and add expanded class', function () {
        var $element = angular.element('<div></div>');
        gridFilter = dataFactory.gridFilterComponent({
            property: 'agaency in agencies',
            id: 'agencies',
            header: 'Agencies',
            option: null,
            initialValues: null,
            expanded: true,
            opened: true,
            gridController: grid
        }, {$element: $element});

        gridFilter.$postLink();
        grid.addFilter(gridFilter);
        expect(grid.items).toBeDefined();
        expect(grid.items.length).toBe(1);
        expect($element.hasClass('grid-filter-expanded')).toBe(true);

    });

    it('should clear filters', function () {
        gridFilter = dataFactory.gridFilterComponent({
            property: 'agencies',
            id: 'agencies',
            header: 'Agencies',
            option: null,
            initialValues: null,
            expanded: true,
            opened: true,
            gridController: grid
        });

        gridFilter.$onInit();
        gridFilter.selectedOptionValues = [{value: 'DoD', selected: false}];
        grid.addFilter(gridFilter);
        grid.clearFilters();
        expect(gridFilter.selectedOptionValues.length).toBe(0);
    });

    it('should not die if no values are found', function () {
        gridFilter = dataFactory.gridFilterComponent({
            property: 'agencies',
            id: 'agencies',
            header: 'Agencies',
            option: null,
            initialValues: null,
            expanded: true,
            opened: true,
            gridController: grid
        });
        gridFilter.$onInit();
        gridFilter.filtered = [];
        expect(grid.doFilter).not.toThrow();
    });

    it('should pull saved params from $location', function () {
        gridFilter = dataFactory.gridFilterComponent({
            property: 'agencies',
            id: 'agencies',
            header: 'Agencies',
            option: null,
            initialValues: null,
            expanded: true,
            opened: true,
            gridController: grid
        });
        $location.search('agencies', 'DoD');
        gridFilter.$onInit();
        gridFilter.selectedOptionValues = [{value: 'DoD', selected: false}];
        grid.addFilter(gridFilter);
        grid.clearFilters();
        expect(gridFilter.selectedOptionValues.length).toBe(0);
    });

    it('should filter on property containing multiple primitive values', function () {
        gridFilter = dataFactory.gridFilterComponent({
            property: 'agency in agencies',
            id: 'agencies',
            header: 'Name',
            expanded: true,
            options: [{value: 'DoD', label: 'Dept of Defense'}, {value:'DEA', label: 'Stuff'}],
            opened: true,
            gridController: grid
        });

        var gridFilterClear = dataFactory.gridClearComponent({
            gridController: grid
        });

        gridFilter.$onInit();
        gridFilter.applyFilter();
        expect(grid.items).toBeDefined();
        expect(grid.items.length).toBe(1);
        expect(gridFilter.selectedOptionValues.length).toBe(0);
        gridFilter.selectOption({value: 'DoD'});
        expect(gridFilter.selectedOptionValues.length).toBe(1);
    });

    it('should filter on property containing multiple object values', function () {
        gridFilter = dataFactory.gridFilterComponent({
            property: 'p.name in products',
            id: 'agencies',
            header: 'Products',
            expanded: true,
            opened: true,
            gridController: grid
        });

        var gridFilterClear = dataFactory.gridClearComponent({
            gridController: grid
        });

        gridFilter.$onInit();
        grid.addFilter(gridFilter);
        gridFilter.applyFilter();
        expect(grid.items).toBeDefined();
        expect(grid.items.length).toBe(1);
        expect(gridFilter.selectedOptionValues.length).toBe(0);
        gridFilter.selectOption({value: 'Treats'});
        expect(gridFilter.selectedOptionValues.length).toBe(1);
    });

    it('should warn user if no filterFunc or optionFunc has been specified when property attribute is not populated', function () {
        gridFilter = dataFactory.gridFilterComponent({
            header: 'Products',
            id: 'agencies',
            property: null,
            filterFunc: null,
            expanded: true,
            opened: true,
            gridController: grid
        });
        expect(gridFilter.$onInit).toThrow();
    });

    it('should warn user if no unique id was provided', function () {
        gridFilter = dataFactory.gridFilterComponent({
            header: 'Products',
            id: null,
            expanded: true,
            opened: true,
            gridController: grid
        });
        expect(gridFilter.$onInit).toThrow();
    });

    it('should wrap custom filter', function () {
        var filterFunc = function(obj, i, arr, selectedOptionValues){
            if(obj.name == 'Amazon'){
                return obj;
            }
            return null;
        };
        gridFilter = dataFactory.gridFilterComponent({
            header: 'Products',
            id: null,
            expanded: true,
            opened: true,
            gridController: grid,
            filterFunc: filterFunc
        });

        gridFilter.applyFilter();
        expect(gridFilter.filtered.length).toBe(1);
    });
});