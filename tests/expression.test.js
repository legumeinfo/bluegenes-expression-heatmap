const React = require('react');
const ReactDOM = require('react-dom');
const imjs = require('imjs');
const queryExpData = require('../src/tissueExpression').queryData;
const Chart = require('../src/tissueExpression').chart;

describe('Tissue Expression Module', () => {
	const mockData = {
		geneId: '1007357',
		orgName: 'Drosophila melanogaster',
		serviceUrl: 'https://www.flymine.org/flymine'
	};

	describe('query', () => {
		test('should return a promise that resolves with correct result json', () => {
			const queryRes = queryExpData(
				mockData.geneId,
				mockData.orgName,
				mockData.serviceUrl,
				imjs
			);

			return queryRes.then(res => {
				expect(res).toHaveProperty('microArrayResults');
				expect(res.microArrayResults).toBeInstanceOf(Array);

				const firstVal = res.microArrayResults[0];
				expect(firstVal).toHaveProperty('enrichment');
				expect(firstVal).toHaveProperty('affyCall');
				expect(firstVal).toHaveProperty('tissue');
				expect(firstVal).toHaveProperty('mRNASignal');
				expect(firstVal).toHaveProperty('objectId');
				expect(firstVal).toHaveProperty('presentCall');
			});
		});

		test('should throw error when data corresponding to organism is not found', () => {
			const dataWithInvalidGeneId = Object.assign({}, mockData, {
				geneId: '1100000' // some wrong gene id
			});

			const queryRes = queryExpData(
				dataWithInvalidGeneId.geneId,
				dataWithInvalidGeneId.orgName,
				dataWithInvalidGeneId.serviceUrl,
				imjs
			);

			return expect(queryRes).rejects.toBe('No data found!');
		});
	});

	describe('component', () => {
		test('should render a canvas element', () => {
			const elem = document.createElement('div');
			ReactDOM.render(<Chart />, elem);
			const html = elem.innerHTML;
			expect(html).toContain('<canvas');
		});
	});
});
