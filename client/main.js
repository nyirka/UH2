import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

//import './main.html';
Session.set('markColor', "white");

Meteor.subscribe('mainText');
Meteor.subscribe('marked');

function markText(keyCode) {
    //add selection:
    var sStr = window.getSelection().toString();
    sStr = sStr.replace(/(\r\n|\n|\r)/gm,"");
    var allText = document.getElementById("allText").innerHTML;
    allText = allText.replace(/(\r\n|\n|\r|\s{2,})/gm,"");
    allText = allText.replace(/(<p>|<\/p>|<mark>|<\/mark>)/g, "");
    posStr = allText.indexOf(sStr);

    var pids = mainText.find({name: 'Kitzbuel'}, {sort: {pid: 1}}).fetch();
    var lenText = 0;
    for (var i = 0; i < pids.length && posStr > -1 && sStr.length > 0; i++) {
        var plen = parseInt(pids[i].plen, 10);
        console.log(lenText + " + " + plen + " >= " + posStr);
        if (lenText + plen > posStr) {
            var startPos, endPos;
            if ((lenText + plen) < (posStr + sStr.length)) {
                endPos = plen;
            }
            else {
                var pPos = posStr + sStr.length - lenText;
                endPos = pPos;
                sStr = "";
                document.getSelection().removeAllRanges();
            }
            if ((lenText < posStr) && (lenText + plen > posStr)) {
                var pPos = posStr - lenText;
                startPos = pPos;
            }
            else {
                startPos = 0;
            }
            var marks = marked.find({pId: pids[i].pid}).fetch();
            for (var j = 0; j < marks.length; j++) {
                if (keyCode === 83 && parseInt(marks[j].endPos, 10) >= startPos && endPos >= parseInt(marks[j].startPos, 10)) {
                    startPos = Math.min(startPos, parseInt(marks[j].startPos));
                    endPos = Math.max(endPos, parseInt(marks[j].endPos));
                    marked.remove({_id: marks[j]._id});
                }
                else if (keyCode === 68 && parseInt(marks[j].endPos, 10) <= endPos && parseInt(marks[j].startPos, 10) >= startPos) {
                    marked.remove({_id: marks[j]._id});
                }
                else if (keyCode === 68 && parseInt(marks[j].endPos, 10) > endPos && parseInt(marks[j].startPos, 10) < startPos) {
                    marked.update(marks[j]._id, {$set: {endPos: startPos}});
                    marked.insert({pId: pids[i].pid, startPos: endPos, endPos: parseInt(marks[j].endPos, 10)});
                }
                else if (keyCode === 68 && parseInt(marks[j].endPos, 10) >= startPos && parseInt(marks[j].startPos, 10) < startPos) {
                    marked.update(marks[j]._id, {$set: {endPos: startPos}});
                }
                else if (keyCode === 68 && parseInt(marks[j].endPos, 10) > endPos && parseInt(marks[j].startPos, 10) <= endPos) {
                    marked.update(marks[j]._id, {$set: {startPos: endPos}});
                }
            }
            if (keyCode === 83) {
                marked.insert({pId: pids[i].pid, startPos: startPos, endPos: endPos});
            }

            marks = marked.find({pId: pids[i].pid}, {sort: {endPos: -1}}).fetch();
            var markedText = pids[i].text;
            for (var j = 0; j < marks.length; j++) {
                markedText = [markedText.slice(0, parseInt(marks[j].endPos, 10)), "</mark>", markedText.slice(parseInt(marks[j].endPos, 10))].join('');
                markedText = [markedText.slice(0, parseInt(marks[j].startPos, 10)), "<mark>", markedText.slice(parseInt(marks[j].startPos, 10))].join('');
            }
            console.log(markedText);
            mainText.update(pids[i]._id, {$set: {markedText: markedText}});
        }
        lenText += plen;
    }
};

Template.itemText.onCreated(() => {
    $(document).on('keyup', (e) => {
        if (e.which === 68 || e.which === 83) {
            markText(e.which);
        }
    });
});

Template.itemText.events({
    /*'click .search': function(e) {
        //e.preventDefault();
        var markColor = Session.get('markColor');
        //console.log(markColor);
        Session.set('markColor', "yellow");
    },
    'click .similarity': function(e) {
        $('input[name="searchInput"]').val("cost,money,$,€");
    },*/
    'click .resetBtn': function(e) {
        console.log("reset");
        /*var pids = mainText.find({name: 'Kitzbuel'}).fetch();
        var lenText = 0;
        for (var i = 0; i < pids.length; i++) {
            mainText.update(pids[i]._id, {$set: {markedText: pids[i].text}});
        }*/
        var marks = marked.find().fetch();
        for (var j = 0; j < marks.length; j++) {
            marked.remove({_id: marks[j]._id});
        }
        var mm = mainText.find().fetch();
        for (var j = 0; j < mm.length; j++) {
            mainText.remove({_id: mm[j]._id});
        }
        if (mainText.find().count() == 0) {
            mainText.insert({name: "Kitzbuel", pid: "1", text: "Kitzbuhel is a small medieval town situated along the river Kitzbuhler Ache in Tyrol, Austria and the administrative centre of the Kitzbuhel district (Bezirk). It has a population of 8,134 (as of 1 January 2013). The town is situated in the Kitzbuhel Alps about 100 kilometres (62 mi) east of the state capital of Innsbruck. It is a ski resort of international renown.", plen: "368", markedText: "Kitzbuhel is a small medieval town situated along the river Kitzbuhler Ache in Tyrol, Austria and the administrative centre of the Kitzbuhel district (Bezirk). It has a population of 8,134 (as of 1 January 2013). The town is situated in the Kitzbuhel Alps about 100 kilometres (62 mi) east of the state capital of Innsbruck. It is a ski resort of international renown."});
            mainText.insert({name: "Kitzbuel", pid: "2", text: "Kitzbuhel, situated on the Kitzbuheler Ache river, is a large valley town with most of its centre car-free, and with a large selection of up-market shops and cafes.", plen: "164", markedText: "Kitzbuhel, situated on the Kitzbuheler Ache river, is a large valley town with most of its centre car-free, and with a large selection of up-market shops and cafes."});
            mainText.insert({name: "Kitzbuel", pid: "3", text: "The town borough is subdivided into the municipalities of: Am Horn, Aschbachbichl, Badhaussiedlung, Bichlach, Ecking, Felseneck, Griesenau, Griesenauweg, Gundhabing, Hagstein, Hausstatt, Henntal, Jodlfeld, Kaps, Muhlau, Obernau, Schattberg, Seereith, Siedlung Frieden, Am Sonnberg, Sonnenhoffeld, Staudach, Stockerdörfl and Zephirau.", plen: "333", markedText: "The town borough is subdivided into the municipalities of: Am Horn, Aschbachbichl, Badhaussiedlung, Bichlach, Ecking, Felseneck, Griesenau, Griesenauweg, Gundhabing, Hagstein, Hausstatt, Henntal, Jodlfeld, Kaps, Muhlau, Obernau, Schattberg, Seereith, Siedlung Frieden, Am Sonnberg, Sonnenhoffeld, Staudach, Stockerdörfl and Zephirau."});
            mainText.insert({name: "Kitzbuel", pid: "4", text: "Kitzbuhel's neighbouring municipalities are: Aurach bei Kitzbuhel, Jochberg, Kirchberg in Tirol, Oberndorf in Tirol, Reith bei Kitzbuhel, St. Johann in Tirol and Fieberbrunn.", plen: "174", markedText: "Kitzbuhel's neighbouring municipalities are: Aurach bei Kitzbuhel, Jochberg, Kirchberg in Tirol, Oberndorf in Tirol, Reith bei Kitzbuhel, St. Johann in Tirol and Fieberbrunn."});
            mainText.insert({name: "Kitzbuel", pid: "5", text: "The first known settlers were Illyrians mining copper in the hills around Kitzbuhel between 1100 and 800 BC.", plen: "108", markedText: "The first known settlers were Illyrians mining copper in the hills around Kitzbuhel between 1100 and 800 BC."});
            mainText.insert({name: "Kitzbuel", pid: "6", text: "Around 15 BC, the Romans under Emperor Augustus extended their empire to include the Alps and established the province of Noricum. After the fall of the western Roman Empire, Bavarii settled in the Kitzbuhel region around 800 and started clearing forests.", plen: "255", markedText: "Around 15 BC, the Romans under Emperor Augustus extended their empire to include the Alps and established the province of Noricum. After the fall of the western Roman Empire, Bavarii settled in the Kitzbuhel region around 800 and started clearing forests."});
            mainText.insert({name: "Kitzbuel", pid: "7", text: "In the 12th century, the name Chizbuhel is mentioned for the first time in a document belonging to the Chiemseemonastery (where it refers to a 'Marquard von Chizbuhel'), whereby Chizzo relates to a Bavarian clan and Buhel refers to the location of a settlement upon a hill. One hundred years later a source refers to the Vogtei of the Bamberg monastery in Kicemgespuchel and, in the 1271 document elevating the settlement to the status of a town, the place is called Chizzingenspuehel.", plen: "485", markedText: "In the 12th century, the name Chizbuhel is mentioned for the first time in a document belonging to the Chiemseemonastery (where it refers to a 'Marquard von Chizbuhel'), whereby Chizzo relates to a Bavarian clan and Buhel refers to the location of a settlement upon a hill. One hundred years later a source refers to the Vogtei of the Bamberg monastery in Kicemgespuchel and, in the 1271 document elevating the settlement to the status of a town, the place is called Chizzingenspuehel."});
            mainText.insert({name: "Kitzbuel", pid: "8", text: "Kitzbuhel became part of Upper Bavaria in 1255 when Bavaria was first partitioned. Duke Ludwig II of Bavaria granted Kitzbuhel town rights on 6 June 1271, and it was fortified with defensive town walls. During the next centuries the town established itself as a market town, growing steadily and remaining unaffected by war and conflict. The town walls were eventually reduced to the level of a single storey building, and the stone used to build residential housing.", plen: "467", markedText: "Kitzbuhel became part of Upper Bavaria in 1255 when Bavaria was first partitioned. Duke Ludwig II of Bavaria granted Kitzbuhel town rights on 6 June 1271, and it was fortified with defensive town walls. During the next centuries the town established itself as a market town, growing steadily and remaining unaffected by war and conflict. The town walls were eventually reduced to the level of a single storey building, and the stone used to build residential housing."});
            mainText.insert({name: "Kitzbuel", pid: "9", text: "When Countess Margarete of Tyrol married the Bavarian, Duke Louis V the Brandenburger, in 1342, Kitzbuhel was temporarily united with the County of Tyrol (that in turn became a Bavarian dominion as a result of the marriage until Louis' death). After the Peace of Schärding (1369) Kitzbuhel was returned to Bavaria. Following the division of Bavaria, Kufstein went to the Landshut line of the House of Wittelsbach. During this time, silver and copper mining in Kitzbuhel expanded steadily and comprehensive mining rights were issued to her that, later, were to become significant to the Bavarian dukedom. On 30 June 1504 Kitzbuhel became a part of Tyrol permanently: the Emperor Maximilian reserved to himself the hitherto Landshut offices (Ämter) of Kitzbuhel, Kufstein and Rattenberg as a part of his Cologne Arbitration (Kölner Schiedsspruch), that had ended the Landshut War of Succession.", plen: "892", markedText: "When Countess Margarete of Tyrol married the Bavarian, Duke Louis V the Brandenburger, in 1342, Kitzbuhel was temporarily united with the County of Tyrol (that in turn became a Bavarian dominion as a result of the marriage until Louis' death). After the Peace of Schärding (1369) Kitzbuhel was returned to Bavaria. Following the division of Bavaria, Kufstein went to the Landshut line of the House of Wittelsbach. During this time, silver and copper mining in Kitzbuhel expanded steadily and comprehensive mining rights were issued to her that, later, were to become significant to the Bavarian dukedom. On 30 June 1504 Kitzbuhel became a part of Tyrol permanently: the Emperor Maximilian reserved to himself the hitherto Landshut offices (Ämter) of Kitzbuhel, Kufstein and Rattenberg as a part of his Cologne Arbitration (Kölner Schiedsspruch), that had ended the Landshut War of Succession."});
            mainText.insert({name: "Kitzbuel", pid: "10", text: "However the law of Louis of Bavaria continued to apply to the three aforementioned places until the 19th century, so that these towns had a special legal status within Tyrol. Maximilian enfeoffed Kitzbuhel, with the result that it came under the rule of the Counts of Lamberg at the end of the 16th century, until 1 May 1840, when Kitzbuhel was ceremonially transferred to the state.", plen: "383", markedText: "However the law of Louis of Bavaria continued to apply to the three aforementioned places until the 19th century, so that these towns had a special legal status within Tyrol. Maximilian enfeoffed Kitzbuhel, with the result that it came under the rule of the Counts of Lamberg at the end of the 16th century, until 1 May 1840, when Kitzbuhel was ceremonially transferred to the state."});
            mainText.insert({name: "Kitzbuel", pid: "11", text: "The wars of the 18th and 19th century bypassed the town, even though its inhabitants participated in the Tyrolean Rebellion against Napoleon. Following the Treaty of Pressburg in 1805, Kitzbuhel once more became part of Bavaria; it was reunited with Tyrol after the fall of Napoleon at the Congress of Vienna. Until 1918, the town (named KITZBICHL before 1895) was part of the Austrian monarchy(Austria side after the compromise of 1867), head of the district of the same name, one of the 21 Bezirkshauptmannschaften in the Tyrol province.", plen: "539", markedText: "The wars of the 18th and 19th century bypassed the town, even though its inhabitants participated in the Tyrolean Rebellion against Napoleon. Following the Treaty of Pressburg in 1805, Kitzbuhel once more became part of Bavaria; it was reunited with Tyrol after the fall of Napoleon at the Congress of Vienna. Until 1918, the town (named KITZBICHL before 1895) was part of the Austrian monarchy(Austria side after the compromise of 1867), head of the district of the same name, one of the 21 Bezirkshauptmannschaften in the Tyrol province."});
            mainText.insert({name: "Kitzbuel", pid: "12", text: "When Emperor Franz Joseph finally resolved the confusing constitutional situation, and following completion of the Salzburg-Tyrol Railway in 1875, the town's trade and industry flourished. In 1894, Kitzbuhel hosted its first ski race, ushering in a new era of tourism and sport.", plen: "278", markedText: "When Emperor Franz Joseph finally resolved the confusing constitutional situation, and following completion of the Salzburg-Tyrol Railway in 1875, the town's trade and industry flourished. In 1894, Kitzbuhel hosted its first ski race, ushering in a new era of tourism and sport."});
            mainText.insert({name: "Kitzbuel", pid: "13", text: "Kitzbuhel also had the good fortune to remain undamaged from the ravages of the First and Second World Wars.Since the year 2000 the town has been a member of the Climate Alliance of Tyrol.", plen: "188", markedText: "Kitzbuhel also had the good fortune to remain undamaged from the ravages of the First and Second World Wars.Since the year 2000 the town has been a member of the Climate Alliance of Tyrol."});
            mainText.insert({name: "Kitzbuel", pid: "14", text: "You can learn more about the history of Kitzbuhel by visiting the local museum. The entrance fee is 5 euro for the adults. Children and students can visit the museum for free.", plen: "175", markedText: "You can learn more about the history of Kitzbuhel by visiting the local museum. The entrance fee is 5 euro for the adults. Children and students can visit the museum for free."});
            mainText.insert({name: "Kitzbuel", pid: "15", text: "Kitzbuhel is one of Austria's best-known and fanciest winter sports resorts, situated between the mountains Hahnenkamm (5616 ft, 1712 m) and Kitzbuhler Horn(6548 ft, 1996 m). The Hahnenkamm is home of the annual World Cup ski races, including the circuit's most important event, the downhill race on the famous Streifslope. This downhill is counted as one of the toughest downhill competitions in the World Cup, and is infamous for having a lot of crashes.", plen: "456", markedText: "Kitzbuhel is one of Austria's best-known and fanciest winter sports resorts, situated between the mountains Hahnenkamm (5616 ft, 1712 m) and Kitzbuhler Horn(6548 ft, 1996 m). The Hahnenkamm is home of the annual World Cup ski races, including the circuit's most important event, the downhill race on the famous Streifslope. This downhill is counted as one of the toughest downhill competitions in the World Cup, and is infamous for having a lot of crashes."});
            mainText.insert({name: "Kitzbuel", pid: "16", text: "In the 1950s, local legends like Ernst Hinterseer, Hias Leitner, Anderl Molterer, Christian Pravda, Fritz Huber Jr. and Toni Sailer wrote skiing history. They put Kitzbuhel on the map and their names still resonate today. Now there is a new generation earning the title of Kitzbuhel legends: Rosi Schipflinger, Axel Naglich, Kaspar Frauenschuh and David Kreiner. With sporting achievements, fashion and food, they are part of Kitzbuhel's unique culture", plen: "452", markedText: "In the 1950s, local legends like Ernst Hinterseer, Hias Leitner, Anderl Molterer, Christian Pravda, Fritz Huber Jr. and Toni Sailer wrote skiing history. They put Kitzbuhel on the map and their names still resonate today. Now there is a new generation earning the title of Kitzbuhel legends: Rosi Schipflinger, Axel Naglich, Kaspar Frauenschuh and David Kreiner. With sporting achievements, fashion and food, they are part of Kitzbuhel's unique culture"});
            mainText.insert({name: "Kitzbuel", pid: "17", text: "Together with the pistes and ski lifts in neighbouring Kirchberg in Tirol, Jochberg and by the Thurn Pass Kitzbuhel is one of the largest ski regions in Austria. With around 10,000 hotel and guest house beds, Kitzbuhel and its neighbours have an unusually high density of guest accommodation.", plen: "292", markedText: "Together with the pistes and ski lifts in neighbouring Kirchberg in Tirol, Jochberg and by the Thurn Pass Kitzbuhel is one of the largest ski regions in Austria. With around 10,000 hotel and guest house beds, Kitzbuhel and its neighbours have an unusually high density of guest accommodation."});
            mainText.insert({name: "Kitzbuel", pid: "18", text: "Holidaymakers in Kitzbuhel have 56 cableway and lift facilities and 168 kilometres of slopes available to them, as well as 40 kilometres of groomed cross-country skiing tracks. Of note is the relatively new 3S Cable Car, the cable car with the highest above-ground span in the world.", plen: "283", markedText: "Holidaymakers in Kitzbuhel have 56 cableway and lift facilities and 168 kilometres of slopes available to them, as well as 40 kilometres of groomed cross-country skiing tracks. Of note is the relatively new 3S Cable Car, the cable car with the highest above-ground span in the world."});
            mainText.insert({name: "Kitzbuel", pid: "19", text: "In summer there are 120 km (75 mi) of mountain bike paths and 500 km (311 mi) of hiking trails.", plen: "95", markedText: "In summer there are 120 km (75 mi) of mountain bike paths and 500 km (311 mi) of hiking trails."});
            mainText.insert({name: "Kitzbuel", pid: "20", text: "Other attractions include six tennis courts and four golf courses, the Kitzbuhel swimming pool, Austria's only curling hall and the bathing lake of Schwarzsee.", plen: "159", markedText: "Other attractions include six tennis courts and four golf courses, the Kitzbuhel swimming pool, Austria's only curling hall and the bathing lake of Schwarzsee."});
            mainText.insert({name: "Kitzbuel", pid: "21", text: "Kitzbuhel also caters for the high end of the tourist market, as many celebrities and the jet set come here for the international races on the Hahnenkamm.", plen: "154", markedText: "Kitzbuhel also caters for the high end of the tourist market, as many celebrities and the jet set come here for the international races on the Hahnenkamm."});
            mainText.insert({name: "Kitzbuel", pid: "22", text: "Together with eleven other towns Kitzbuhel is a member of the community Best of the Alps.", plen: "89", markedText: "Together with eleven other towns Kitzbuhel is a member of the community Best of the Alps."});
            mainText.insert({name: "Kitzbuel", pid: "23", text: "Getting to Kitzbuhel is easy via Salzburg, Innsbruck or Munich airports with short transfer times from all three airports. Transfer options include rail to Kitzbuhel mainline train station and a good bus service to and from Munich airport as well as shared and private minibus transfers from the airports.", plen: "305", markedText: "Getting to Kitzbuhel is easy via Salzburg, Innsbruck or Munich airports with short transfer times from all three airports. Transfer options include rail to Kitzbuhel mainline train station and a good bus service to and from Munich airport as well as shared and private minibus transfers from the airports."});
            mainText.insert({name: "Kitzbuel", pid: "24", text: "There are a number of airlines operating direct flights to Munich: easyJet, Lufthansa, British Airways, Singapure Airlines, Rayan Air.", plen: "134", markedText: "There are a number of airlines operating direct flights to Munich: easyJet, Lufthansa, British Airways, Singapure Airlines, Rayan Air."});
            mainText.insert({name: "Kitzbuel", pid: "25", text: "Kitzbuhel, in the eastern corner of the TIrol, is 74km from Salzburg, 97km from Innsbruck and 174km from Munich. There is also a good bus service to and from Munich airport.", plen: "173", markedText: "Kitzbuhel, in the eastern corner of the TIrol, is 74km from Salzburg, 97km from Innsbruck and 174km from Munich. There is also a good bus service to and from Munich airport."});
            mainText.insert({name: "Kitzbuel", pid: "26", text: "Salzburg Airport - 74km / 1 hour 10 minutes", plen: "43", markedText: "Salzburg Airport - 74km / 1 hour 10 minutes"});
            mainText.insert({name: "Kitzbuel", pid: "27", text: "Innsbruck Airport - 97km / 1 hour 15 minutes", plen: "44", markedText: "Innsbruck Airport - 97km / 1 hour 15 minutes"});
            mainText.insert({name: "Kitzbuel", pid: "28", text: "Munich Airport - 174km / 1 hour 50 minutes", plen: "42", markedText: "Munich Airport - 174km / 1 hour 50 minutes"});
            mainText.insert({name: "Kitzbuel", pid: "31", text: "Four Seasons Travel in Innsbruck provides a reliable airport transfer shuttle service to Kitzbuhel (and other Tirol destinations) from Innsbruck, Munich, Salzburg, Bolzano and Memmingen airports. The range of transfer services includes shared airport shuttle, private transfers in minivans seating up to 8 persons and 19-50 seat coaches for groups and a first class limousine service. Four Seasons customer support includes 24-hour telephone response 365 days per year as well as easy and secure booking online.", plen: "511", markedText: "Four Seasons Travel in Innsbruck provides a reliable airport transfer shuttle service to Kitzbuhel (and other Tirol destinations) from Innsbruck, Munich, Salzburg, Bolzano and Memmingen airports. The range of transfer services includes shared airport shuttle, private transfers in minivans seating up to 8 persons and 19-50 seat coaches for groups and a first class limousine service. Four Seasons customer support includes 24-hour telephone response 365 days per year as well as easy and secure booking online."});
            mainText.insert({name: "Kitzbuel", pid: "32", text: "Discount option for Lufthansa travelors. You will receive a discount of 10 % on both shuttle services. If you book when you arrive, simply show your Lufthansa boarding pass. If booking online, please use the relevant Lufthansa Shuttle pages of Four Seasons Travel and enter your flight number. ", plen: "294", markedText: "Discount option for Lufthansa travelors. You will receive a discount of 10 % on both shuttle services. If you book when you arrive, simply show your Lufthansa boarding pass. If booking online, please use the relevant Lufthansa Shuttle pages of Four Seasons Travel and enter your flight number. "});
            mainText.insert({name: "Kitzbuel", pid: "34", text: "Kitzbuhel has its own mainline train station, and a post-bus picks up passengers from there every 15 minutes. Regular Eurocity trains depart from Munich and Zurich to Innsbruck, from where several trains daily make the one-hour trip to Kitzbuhel. ", plen: "247", markedText: "Kitzbuhel has its own mainline train station, and a post-bus picks up passengers from there every 15 minutes. Regular Eurocity trains depart from Munich and Zurich to Innsbruck, from where several trains daily make the one-hour trip to Kitzbuhel. "});
            mainText.insert({name: "Kitzbuel", pid: "35", text: "The Brixental Road, the B170, from Wörgl intersects in Kitzbuhel with the Thurn Pass Road, the B161, from Mittersill to St. Johann in Tirol. Kitzbuhel station is a major bus stop for buses to Lienz and Worgl. The town of the chamois, as Kitzbuhel is affectionately known, is easily accessible by road and by rail. From the airport cities Munich, Salzburg, and Innsbruck, it takes a maximum of one and a half hours by car to get to Kitzbuhel.", plen: "441", markedText: "The Brixental Road, the B170, from Wörgl intersects in Kitzbuhel with the Thurn Pass Road, the B161, from Mittersill to St. Johann in Tirol. Kitzbuhel station is a major bus stop for buses to Lienz and Worgl. The town of the chamois, as Kitzbuhel is affectionately known, is easily accessible by road and by rail. From the airport cities Munich, Salzburg, and Innsbruck, it takes a maximum of one and a half hours by car to get to Kitzbuhel."});
            mainText.insert({name: "Kitzbuel", pid: "37", text: "Kitzbuhel Hauptbahnhof, Kitzbuhel Hahnenkamm and Kitzbuhel Schwarzsee are stops on the Salzburg-Tyrol Railway. Whilst Hahnenkamm and Schwarzsee stations are served by local trains only, long distance services from Innsbruck and Graz stop at Kitzbuhel station. Kitzbuhel station has just been rebuilt (2010) and been equipped with new barrier-less platforms with underpasses and a lift.", plen: "385", markedText: "Kitzbuhel Hauptbahnhof, Kitzbuhel Hahnenkamm and Kitzbuhel Schwarzsee are stops on the Salzburg-Tyrol Railway. Whilst Hahnenkamm and Schwarzsee stations are served by local trains only, long distance services from Innsbruck and Graz stop at Kitzbuhel station. Kitzbuhel station has just been rebuilt (2010) and been equipped with new barrier-less platforms with underpasses and a lift."});
            mainText.insert({name: "Kitzbuel", pid: "38", text: "It is here that skiing was invented, here where ski races have regularly been taking place since 1895 and here where the most important international race of the Winter World Cup has been taking place on the Streif for decades. Yet, it is not only because of Kitzbuhel's fantastic ski resort that so many visitors are taken by the irresistible charm of Kitzbuhel. The unique mix of traditional and contemporary attracts skiers and celebrities from all over the world. The above average number of luxury hotels, the high density of award-winning restaurants in Tyrol and the many unforgettable après-ski events make Kitzbuhel the ideal meeting place for snow enthusiasts all winter long.", plen: "686", markedText: "It is here that skiing was invented, here where ski races have regularly been taking place since 1895 and here where the most important international race of the Winter World Cup has been taking place on the Streif for decades. Yet, it is not only because of Kitzbuhel's fantastic ski resort that so many visitors are taken by the irresistible charm of Kitzbuhel. The unique mix of traditional and contemporary attracts skiers and celebrities from all over the world. The above average number of luxury hotels, the high density of award-winning restaurants in Tyrol and the many unforgettable après-ski events make Kitzbuhel the ideal meeting place for snow enthusiasts all winter long."});
            mainText.insert({name: "Kitzbuel", pid: "39", text: "Big names, ski pioneers and the high society but also Tyrolean down-to-earthness, Gemutlichkeit and hospitality: these contrasts are what make Kitzbuhel one of the greatest ski resorts in the Alps. Kitzbuhel is even recognised as the Best Ski Resort in the World for 2013. With 51 cable cars and lifts, connecting 170 kilometres of ski slopes, Bergbahn AG Kitzbuhel is one of the largest cable car companies in Austria. In addition to the spectacular Streif , Kitzbuhel trumps with a variety of ski runs suiting all sizes and ski styles. In fact, the vast and snow-reliable ski resort boasts an above-average number of family runs (69 km easy, 77 km intermediate, 24 km difficult). The flagship run is, of course, the Family Streif, which elegantly snakes its way around the extremely steep part of the downhill course, before returning to the original racing track at the Seidlalm, dodging the Hausbergkante ridge on the incline Ganslernhang and ends up back at the usual finish. Don t miss out on the most spectacular lift in the world: the 3S-Umlaufbahn (tri-cable gondola). It spans the 2.5-kilometre wide and 400-meter deep Saukaser Valley between the mountains Pengelstein and the Wurzhöhe. Snowboarders and freeskiers will also find their perfect playground on the Resterhöhe. The experienced QParks team lead by Franz Lechner is responsible for the setup of the Hanglalm Park as well as for the park on the Kitzbuheler Horn, including all kicker, rail, jib and tree lines, picnic tables and chill-out areas. Skiers and boarders keen to head off-piste will love Kitzbuhel s 200 km2 backcountry. Around the 32 kilometres of ski routes there are endless opportunities to ride through perfect deep powder snow.", plen: "1714", markedText: "Big names, ski pioneers and the high society but also Tyrolean down-to-earthness, Gemutlichkeit and hospitality: these contrasts are what make Kitzbuhel one of the greatest ski resorts in the Alps. Kitzbuhel is even recognised as the Best Ski Resort in the World for 2013. With 51 cable cars and lifts, connecting 170 kilometres of ski slopes, Bergbahn AG Kitzbuhel is one of the largest cable car companies in Austria. In addition to the spectacular Streif , Kitzbuhel trumps with a variety of ski runs suiting all sizes and ski styles. In fact, the vast and snow-reliable ski resort boasts an above-average number of family runs (69 km easy, 77 km intermediate, 24 km difficult). The flagship run is, of course, the Family Streif, which elegantly snakes its way around the extremely steep part of the downhill course, before returning to the original racing track at the Seidlalm, dodging the Hausbergkante ridge on the incline Ganslernhang and ends up back at the usual finish. Don t miss out on the most spectacular lift in the world: the 3S-Umlaufbahn (tri-cable gondola). It spans the 2.5-kilometre wide and 400-meter deep Saukaser Valley between the mountains Pengelstein and the Wurzhöhe. Snowboarders and freeskiers will also find their perfect playground on the Resterhöhe. The experienced QParks team lead by Franz Lechner is responsible for the setup of the Hanglalm Park as well as for the park on the Kitzbuheler Horn, including all kicker, rail, jib and tree lines, picnic tables and chill-out areas. Skiers and boarders keen to head off-piste will love Kitzbuhel s 200 km2 backcountry. Around the 32 kilometres of ski routes there are endless opportunities to ride through perfect deep powder snow."});
            mainText.insert({name: "Kitzbuel", pid: "40", text: "After dark, the 700-year-old Old Town with its typical apres ski bars and pubs becomes the social hub of the world. Fashionistas will be in their element hopping between international designer addresses, from Bogner and Boss, Gucci, to Prada and Louis Vuitton. And between them, classic Kitzbuhel fashion originals, such as Sportalm, Frauenschuh, Franz Prader and Helmut Eder, add a traditional element to the vibrant collection.", plen: "429", markedText: "After dark, the 700-year-old Old Town with its typical apres ski bars and pubs becomes the social hub of the world. Fashionistas will be in their element hopping between international designer addresses, from Bogner and Boss, Gucci, to Prada and Louis Vuitton. And between them, classic Kitzbuhel fashion originals, such as Sportalm, Frauenschuh, Franz Prader and Helmut Eder, add a traditional element to the vibrant collection."});
            mainText.insert({name: "Kitzbuel", pid: "41", text: "From 24 November to 25 December, the town centre will be transformed into a festive scene. During the holiday period, Kitzbuhel can well and truly say, Welcome to the most magical Christmas town in the Alps!", plen: "207", markedText: "From 24 November to 25 December, the town centre will be transformed into a festive scene. During the holiday period, Kitzbuhel can well and truly say, Welcome to the most magical Christmas town in the Alps!"});
            mainText.insert({name: "Kitzbuel", pid: "42", text: "A further winter attraction is the biggest Polo Tournament staged on a snow covered pitch in the world. Fans gather in their thousands to watch eight teams compete against each other for the honour of winning such a unique and prestigious event.", plen: "245", markedText: "A further winter attraction is the biggest Polo Tournament staged on a snow covered pitch in the world. Fans gather in their thousands to watch eight teams compete against each other for the honour of winning such a unique and prestigious event."});
            mainText.insert({name: "Kitzbuel", pid: "43", text: "The most legendary sports resort in the Alps, awarded the title world s best ski resort for the third time in succession, is taking a break from mountains and slopes to show off its contemplative side. The Gamsstadt (Chamois City) is a paradise for winter sports and summer fun. The Advent season in Kitzbuhel is yet another magical experiences to be enjoyed here. Whether in Kitzbuhel itself, at the foot of the legendary Hahnenkamm at the Hotel Rasmushof, or in the villages of Reith and Jochberg, visitors to the region during the pre-Christmas period will be treated to a variety of Tirolean delights. Featuring a colourful mix of tradition, local customs and international flair, it does not get much more stylish or festive than this.", plen: "740", markedText: "The most legendary sports resort in the Alps, awarded the title world s best ski resort for the third time in succession, is taking a break from mountains and slopes to show off its contemplative side. The Gamsstadt (Chamois City) is a paradise for winter sports and summer fun. The Advent season in Kitzbuhel is yet another magical experiences to be enjoyed here. Whether in Kitzbuhel itself, at the foot of the legendary Hahnenkamm at the Hotel Rasmushof, or in the villages of Reith and Jochberg, visitors to the region during the pre-Christmas period will be treated to a variety of Tirolean delights. Featuring a colourful mix of tradition, local customs and international flair, it does not get much more stylish or festive than this."});
            mainText.insert({name: "Kitzbuel", pid: "44", text: "Don t miss the grand opening in the scenic town centre on 24 November at 6.00 p.m. We recommend getting there on time, as this is certainly one of the most traditional and beautiful Christmas Markets for miles around.", plen: "217", markedText: "Don t miss the grand opening in the scenic town centre on 24 November at 6.00 p.m. We recommend getting there on time, as this is certainly one of the most traditional and beautiful Christmas Markets for miles around."});
            mainText.insert({name: "Kitzbuel", pid: "45", text: "Enjoy a hands-on activity with your children in anticipation of the arrival of Father Christmas. Animals are on hand daily for petting and riding. Cuddling hours are from 3 p.m. to 7 p.m. with pony rides and a petting zoo. But that s not all we have in store for our youngest visitors. Hidden eye-catchers have been hidden throughout to delight and entertain. Visitors can also sample all manner of excellent traditional Tirolean food, of which Kitzbuhel is particularly proud. As temperatures plunge, warm up with culinary delights. After all, this is what the run-up to Christmas is all about! Everywhere one looks, the town abounds with brightly lit stalls brimming with treasures to be discovered. The Alpine joie de vivre is more than just a delight for the palate. At the many craft stalls, shoppers can find regional pottery, basket weaving and carved creations. Every day between 6.00 p.m. and 7.00 p.m., local musicians and choirs will bring the entire market area to life with the sound of music. And that s not all Kitzbuhel has to offer during the pre-Christmas period! Head to the Kitzbuhel Museum, where from 3.00 p.m. on Christmas Eve a Christmas reading session will be held. Your child will be all ears with the magic of the holiday season!", plen: "1257", markedText: "Enjoy a hands-on activity with your children in anticipation of the arrival of Father Christmas. Animals are on hand daily for petting and riding. Cuddling hours are from 3 p.m. to 7 p.m. with pony rides and a petting zoo. But that s not all we have in store for our youngest visitors. Hidden eye-catchers have been hidden throughout to delight and entertain. Visitors can also sample all manner of excellent traditional Tirolean food, of which Kitzbuhel is particularly proud. As temperatures plunge, warm up with culinary delights. After all, this is what the run-up to Christmas is all about! Everywhere one looks, the town abounds with brightly lit stalls brimming with treasures to be discovered. The Alpine joie de vivre is more than just a delight for the palate. At the many craft stalls, shoppers can find regional pottery, basket weaving and carved creations. Every day between 6.00 p.m. and 7.00 p.m., local musicians and choirs will bring the entire market area to life with the sound of music. And that s not all Kitzbuhel has to offer during the pre-Christmas period! Head to the Kitzbuhel Museum, where from 3.00 p.m. on Christmas Eve a Christmas reading session will be held. Your child will be all ears with the magic of the holiday season!"});
            mainText.insert({name: "Kitzbuel", pid: "46", text: "The big highlight in Kitzbuehels year always takes place on 1st January. The Rasmusleiten brings tens of thousands of spectators to an event in extra class: Torch skiing the ski schools 'Red Devils' and 'Element3', fire jumping, music, and of course the spectacular fireworks of the world famous Pyro professionals Armin Lukasser. Beginning: 17.30 hr. Free admission! Moreover, with Reith it is on 30.12. and in Jochberg on the 31.12. A total 3 fireworks displays in 3 days- this is unique to the region! ", plen: "505", markedText: "The big highlight in Kitzbuehels year always takes place on 1st January. The Rasmusleiten brings tens of thousands of spectators to an event in extra class: Torch skiing the ski schools 'Red Devils' and 'Element3', fire jumping, music, and of course the spectacular fireworks of the world famous Pyro professionals Armin Lukasser. Beginning: 17.30 hr. Free admission! Moreover, with Reith it is on 30.12. and in Jochberg on the 31.12. A total 3 fireworks displays in 3 days- this is unique to the region! "});
            mainText.insert({name: "Kitzbuel", pid: "47", text: "Kitzbuehel welcomes the new year with a class winter sport. For the 15th time the Snow Polo World Cup will be held on the outskirts of Kitzbuehel from 12 to 15 January, 2017. The event is regarded as the world's largest polo tournament on snow and shines with action-packed equestrian and elegant ambiance. Enjoy the opening in the centre of Kitzbuehel on Thursday. Come and watch the exciting games from Friday to Sunday against the beautiful backdrop of the Wilder Kaiser. Free admission! ", plen: "491", markedText: "Kitzbuehel welcomes the new year with a class winter sport. For the 15th time the Snow Polo World Cup will be held on the outskirts of Kitzbuehel from 12 to 15 January, 2017. The event is regarded as the world's largest polo tournament on snow and shines with action-packed equestrian and elegant ambiance. Enjoy the opening in the centre of Kitzbuehel on Thursday. Come and watch the exciting games from Friday to Sunday against the beautiful backdrop of the Wilder Kaiser. Free admission! "});
            mainText.insert({name: "Kitzbuel", pid: "48", text: "The 2017 program will start on Thursday, 12 January with the entrance of teams in the centre of Kitzbuehel in front of the 'Hotel Zur Tenne'. There, the teams will be presented to the fans and the press. The action-packed games begin in the morning on the lawn in Munichauer, Reith from Friday 13thto Sunday 15th. All guests and locals are invited to watch and learn the sport with free admission. The social highlight will again be the Saturday's VIP party ('Polo Player's Night') in the elegant tent on the polo field. VIP tickets for days and the VIP evenings are available on game days - locally.", plen: "600", markedText: "The 2017 program will start on Thursday, 12 January with the entrance of teams in the centre of Kitzbuehel in front of the 'Hotel Zur Tenne'. There, the teams will be presented to the fans and the press. The action-packed games begin in the morning on the lawn in Munichauer, Reith from Friday 13thto Sunday 15th. All guests and locals are invited to watch and learn the sport with free admission. The social highlight will again be the Saturday's VIP party ('Polo Player's Night') in the elegant tent on the polo field. VIP tickets for days and the VIP evenings are available on game days - locally."});
            mainText.insert({name: "Kitzbuel", pid: "49", text: " A colourful program provides the Kitzbuehel Snow Arena party atmosphere. There shouldn t be too many prominent faces missing. A contrast with the snow-show: The 'Players Night' on Saturday has a star DJ will entertain the 700 guests at the gala dinner. Despite the prominent onlookers it is casual Kitzbuehel really down to earth. 'Precious does not mean untouchable,' brings Elmar Balster the organizer lifestyle events to the point:' Kitzbuehel 2016, combines world-class polo with Tyrolean joy and fair play'", plen: "512", markedText: " A colourful program provides the Kitzbuehel Snow Arena party atmosphere. There shouldn t be too many prominent faces missing. A contrast with the snow-show: The 'Players Night' on Saturday has a star DJ will entertain the 700 guests at the gala dinner. Despite the prominent onlookers it is casual Kitzbuehel really down to earth. 'Precious does not mean untouchable,' brings Elmar Balster the organizer lifestyle events to the point:' Kitzbuehel 2016, combines world-class polo with Tyrolean joy and fair play'"});
            mainText.insert({name: "Kitzbuel", pid: "50", text: "Polo is a team sport in which there are four players per team, riding on horses, a seven to eight cm. dia, 130 gram ball. The aim is to try to hit the ball with a long wooden stick and score in the opponent's goal. Arena Polo is the same but played on a smaller playing field with only 3 players per team.", plen: "305", markedText: "Polo is a team sport in which there are four players per team, riding on horses, a seven to eight cm. dia, 130 gram ball. The aim is to try to hit the ball with a long wooden stick and score in the opponent's goal. Arena Polo is the same but played on a smaller playing field with only 3 players per team."});
            mainText.insert({name: "Kitzbuel", pid: "51", text: "From 17 to 22 January 2017, the entire ski world gets Hahnenkamm fever. The best ski athletes in the world will gather in Kitzbuehel to celebrate the highlight of the World Cup calendar. The Streif is considered the most spectacular ski run in the world and will require the participants to tackle almost everything. ", plen: "317", markedText: "From 17 to 22 January 2017, the entire ski world gets Hahnenkamm fever. The best ski athletes in the world will gather in Kitzbuehel to celebrate the highlight of the World Cup calendar. The Streif is considered the most spectacular ski run in the world and will require the participants to tackle almost everything. "});
            mainText.insert({name: "Kitzbuel", pid: "52", text: "Jumps up to 80m, steep slopes up to 85% gradient, speeds up to 140 km/hr, 860 meters height difference from the starting gate (1665m) to the finish (805m). A total length of 3312 metres at more than average speed of 103 km / h.", plen: "227", markedText: "Jumps up to 80m, steep slopes up to 85% gradient, speeds up to 140 km/hr, 860 meters height difference from the starting gate (1665m) to the finish (805m). A total length of 3312 metres at more than average speed of 103 km / h."});
            mainText.insert({name: "Kitzbuel", pid: "53", text: "Since 1931, the Hahnenkamm races has taken place from Kitzbuehel Hausberg mountain. The fixed points since the early years are the run down the Streif and the Slalom on Ganslernhang . The historic-slalom slope will be in use again after short break in the last years. Since the 1990s a super-G on the Streif is disputed, which Friday the ski weekend ushers.", plen: "357", markedText: "Since 1931, the Hahnenkamm races has taken place from Kitzbuehel Hausberg mountain. The fixed points since the early years are the run down the Streif and the Slalom on Ganslernhang . The historic-slalom slope will be in use again after short break in the last years. Since the 1990s a super-G on the Streif is disputed, which Friday the ski weekend ushers."});
            mainText.insert({name: "Kitzbuel", pid: "54", text: "For Kitzbuehel, the Hahnenkamm event the sporting and social highlight of the year and sees the Gamsstadt bursting at the seams with reporters and celebrities from around the world flocking to the streets. A variety of parties and side events take place spread over the whole week. Television pictures of the wintry Kitzbuehel go around the globe and reach 500 million people. You too can also enjoy the unique Hahnenkamm flair in Kitzbuehel and cheer on, with tens of thousands of fans, the best skiers in the world!", plen: "517", markedText: "For Kitzbuehel, the Hahnenkamm event the sporting and social highlight of the year and sees the Gamsstadt bursting at the seams with reporters and celebrities from around the world flocking to the streets. A variety of parties and side events take place spread over the whole week. Television pictures of the wintry Kitzbuehel go around the globe and reach 500 million people. You too can also enjoy the unique Hahnenkamm flair in Kitzbuehel and cheer on, with tens of thousands of fans, the best skiers in the world!"});
        }
        console.log("reset done");
    }
});

Template.itemText.helpers({
    'color': function() {
        return Session.get('markColor');
    },
    'showText': function() {
        //console.log('aaaaa' + html2text.find().count());
        //var pids = mainText.find({name: 'Kitcbuel'}, {sort: {pid: 1}}).fetch();

        /*for (var i = 0; i < pids.length; i++) {
            var marks = marked.find({pId: pids[i].pid}, {sort: {endPos: -1}}).fetch();
            var markedText = pids[i].text;
            for (var j = 0; j < marks.length; j++) {
                markedText = [markedText.slice(0, parseInt(marks[j].endPos)), "</mark>", markedText.slice(parseInt(marks[j].endPos))].join('');
                markedText = [markedText.slice(0, parseInt(marks[j].startPos)), "<mark>", markedText.slice(parseInt(marks[j].startPos))].join('');
            }
            console.log(markedText);
            mainText.update(pids[i]._id, {$set: {markedText: markedText}});
        }*/
        return mainText.find({name: 'Kitzbuel'}, {sort: {pid: 1}}).fetch();
    }
});

function aggregateMarks() {
    var marks = marked.find().fetch();
    if (marks.length > 0) {
        aggs = [marks[0]];
        aggs[0].num = 1;
        for (var i = 1; i < marks.length; i++) {
            var newAggs = aggs.slice();
            var insertFlg = true;
            for (var j = 0; j < aggs.length; j++) {
                if (marks[i].pid == aggs[j].pid) {
                    if (marks[i].startPos == aggs[j].startPos && marks[i].endPos == aggs[j].endPos) {
                        newAggs.num += 1;
                        insertFlg = false;
                    }
                    else if (parseInt(marks[i].endPos, 10) > parseInt(aggs[j].startPos, 10) && parseInt(aggs[j].endPos, 10) > parseInt(marks[i].startPos, 10)) {
                        var mins = [parseInt(marks[i].endPos, 10), parseInt(aggs[j].startPos, 10), parseInt(marks[i].startPos, 10), parseInt(aggs[j].endPos, 10)];
                        mins.sort();
                        newAggs.push({pid: aggs[j].pid, startPos: mins[0], endPos: mins[1], num: 1});
                        newAggs.push({pid: aggs[j].pid, startPos: mins[1], endPos: mins[2], num: 1});
                        newAggs.push({pid: aggs[j].pid, startPos: mins[2], endPos: mins[3], num: 1});
                        insertFlg = false;
                    }
                }
            }
            if (insertFlg) {
                newAggs.push({pid: marks[i].pid, startPos: marks[i].startPos, endPos: marks[i].endPos, num: 1});
            }
            aggs = newAggs.slice();
        }
    }
};

function sortNumber(a,b) {
    return a - b;
}

function countMarks() {
    var markedP = [];
    var posArr = {};
    var posDict = {};
    var marks = marked.find().fetch();
    for (var j = 0; j < marks.length; j++) {
        if (!(marks[j].pId in posArr)) {
            console.log('Create new paragraph entrance');
            markedP.push(parseInt(marks[j].pId, 10));
            posArr[marks[j].pId] = [];
            posDict[marks[j].pId] = {};
        }

        var startPos = parseInt(marks[j].startPos, 10);
        var endPos = parseInt(marks[j].endPos, 10);
        if (!(startPos in posArr[marks[j].pId])) {
            posArr[marks[j].pId].push(startPos);
            posDict[marks[j].pId][startPos] = 1;
        }
        else {
            posDict[marks[j].pId][startPos] = posDict[marks[j].pId][startPos] + 1;
        }

        if (!(endPos in posArr[marks[j].pId])) {
            posArr[marks[j].pId].push(endPos);
            posDict[marks[j].pId][endPos] = -1;
        }
        else {
            posDict[marks[j].pId][endPos] = posDict[marks[j].pId][endPos] - 1;
        }
    }

    markedP.sort(sortNumber);
    var displayArr = [];
    for (var j = 0; j < markedP.length; j++) {
        posArr[markedP[j]].sort(sortNumber);
        var pid = mainText.find({name: 'Kitzbuel', pid: markedP[j].toString()}).fetch();
        var i = 0;
        var weight = 0;
        while (i < posArr[markedP[j]].length - 1) {
            weight = weight + posDict[markedP[j]][posArr[markedP[j]][i]];
            if (weight == 0) {
                i++;
            }
            else {
                var k = i + 1;
                while (posDict[markedP[j]][posArr[markedP[j]][k]] == 0) {
                    k++;
                }
                displayArr.push({text: pid[0].text.slice(posArr[markedP[j]][i], posArr[markedP[j]][k]), refCount: weight});
                i = k;
            }
        }
    }
    return displayArr;



    /*for (var j = 0; j < marks.length; j++) {
        if (!(marks[j].pId in posArr)) {
            console.log('Create new paragraph entrance');
            posArr[marks[j].pId] = [];
            posDict[marks[j].pId] = {};
        }
        var k = 0;
        var weight = 0;
        var startPos = parseInt(marks[j].startPos, 10);
        var endPos = parseInt(marks[j].endPos, 10);
        while ((k < posArr[marks[j].pId].length) && (posArr[marks[j].pId][k] < startPos)) {
            weight = posDict[marks[j].pId][posArr[marks[j].pId][k]];
            k++;
        }
        if (k >= posArr[marks[j].pId].length) {
            posArr[marks[j].pId].push(startPos);
            posDict[marks[j].pId][startPos] = 1;
        }
        else if (posArr[marks[j].pId][k] == startPos) {
            posDict[marks[j].pId][startPos] = weight + 1;
            //check if we need to merge intervals:
            if (true) {
            }
        }
        else {
            posArr[marks[j].pId].splice(k, 0, startPos);
            posDict[marks[j].pId][startPos] = weight + 1;
        }
    }


    var posDict = {0: 0, 9: 0, 10: 1, 11:2, 15: 3, 19: 3, 20: 2, 21: 0, 29: 0, 30: 1, 40: 1};
    var posArr = [0, 9, 10, 11, 15, 19, 20, 30, 40];

    posArr = posArr.sort();
    var displayArr = [];
    var pid = mainText.find({name: 'Kitcbuel', pid: '1'}, {sort: {pid: 1}}).fetch();
    for (var i = 1; i < posArr.length; i++) {
        if (posDict[posArr[i]] >= posDict[posArr[i-1]]) {
            displayArr.push({text: pid[0].text.slice(posArr[i-1], posArr[i]), refCount: posDict[posArr[i-1]]})
        } else {
            displayArr.push({text: pid[0].text.slice(posArr[i-1], posArr[i]), refCount: posDict[posArr[i]]})
        }
    }
    return displayArr;*/
};

Template.BTaskUI.helpers({
    'showMarks': function() {
        console.log("here");
        //aggregateMarks();
    },
    'pMarks': function() {
        var displayArr = countMarks(); //[{refCount: 10, text: 'asdf'}, {refCount: 11, text: 'asdddff'}];
        return displayArr;
        /*return _.map(this.Address, function(value, key) {
            return {
                key: key,
                value: value
            };
        });*/
    }
});

/*Session.setDefault('page', 'home');

Template.UI.helpers({
  isPage: function(page){
    return Session.equals('page', page)
  }
})

Template.UI.events({
  'click .clickChangesPage': function(event, template){
    Session.set('page', event.currentTarget.getAttribute('data-page'))
  }
})

Template.hello.events({
    'click button'(event, instance) {
      // Go no next page
      //Router.go('/product');
  },
});

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
*/