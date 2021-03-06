import fakeDataProvider from 'ra-data-fakerest';
import data from './security-breach-v1';

function dataCounts(data, k, transformed) {
    // Get unique counts
    transformed[k]=[]
    var x = data.reduce((acc, val) => {
        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
        return acc;
    }, {});
    // Add counts to our key
    Object.keys(x).forEach(function (key) {
        transformed[k].push([key, x[key]])
    });
    return(transformed)
}

function transformMissingInt(breach, key){
    // Handle missing keys gracefully
    breach[key]=""
    if (breach['tags'].hasOwnProperty(key) && breach['tags'][key] !== 0 && breach['tags'][key] !== null) {
            breach[key]=breach['tags'][key]
    }
    
    return breach
}

function getType(v){
    if (v.indexOf(":")){
        var fields = v.split(":")
        return fields[0]
    }
    return v
}

function getAccessDescription(data, val){
    if(val === ""){
        return "?"
    }
    if(val === "?"){
        return val
    }
    if(data['initial-access'].hasOwnProperty(val)){
        return data['initial-access'][val]['description']
    }
    else {
        console.log('Unable to find definition for: ' + val)
        return val
    }
}


function transformData(data) {
    // react-admin is finicky about it's data, need to massage it a little
    var transformed = {};
    // add our top level keys
    transformed['breaches']=[];
    // create some temporary variables
    var motives = [];
    var access = [];
    var actor = [];
    var years = [];
    data.breaches.forEach(function(breach){
        // Add a Start Date key so it's easier to display/sort in react-admin
        var month = breach['month'];
        if (breach['month'] < 10){
            month = "0"+breach['month'].toString();
        }
        breach['Start Date'] = breach['year'].toString()+month

        // Convert links to a format react-admin likes
        var links = [];
        breach.links.forEach(function(link){
            links.push({url:link})
        });
        breach['links']=links;
        transformed['breaches'].push(breach);

        // Copy imperitive tags to top level so it's easier to sort in both react-admin and in the export
        breach['actor']=breach['tags']['actor']
        breach['motive']=breach['tags']['motive']
        breach['initial-access']=breach['tags']['initial-access']
        breach['initial-access-description']=getAccessDescription(data['tag-taxonomy'], breach['initial-access'])
        // Gracefully handle some missing int tags
        breach=transformMissingInt(breach, 'cost-usd')
        breach=transformMissingInt(breach, 'impacted-user-count')

        // Add data we want to graph on the dashboard
        // Filter out unknowns, it tells a better story.
        if(breach['tags']['initial-access'] !== "?"){
            access.push(breach['tags']['initial-access']);
        }
        // Break down motive & actor to type, makes for a better graph/insight
        if(breach['tags']['motive'] !== "?"){
            motives.push(getType(breach['tags']['motive']));
        }
        // Actor
        if(breach['tags']['actor'] !== "?"){
            actor.push(getType(breach['tags']['actor']))
        }
        // Years
        years.push(breach['year'])
    });
    transformed=dataCounts(years, 'years', transformed)
    transformed=dataCounts(motives, 'motives', transformed)
    transformed=dataCounts(access, 'access', transformed)
    transformed=dataCounts(actor, 'actor', transformed)
    // Access data needs an additional transformation
    // ATT&CK:T1193 isn't apparent that it's attributed to "Spearphishing Attachment"
    transformed['access'].forEach(function(item, index){
        transformed['access'][index][0] = getAccessDescription(data['tag-taxonomy'], item[0])
    });
    console.log(transformed)
    return(transformed);
}

const dataProvider = fakeDataProvider(transformData(data));
export default dataProvider;
