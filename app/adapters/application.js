import DS from 'ember-data';

var ApplicationAdapter = DS.LSAdapter.extend({
   namespace: 'api/v1'
});

export default ApplicationAdapter;

