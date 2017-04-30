// Model types

export class Arrangement{}
export class Pub {}
export class Person {}


// Mock data

const c2c2017 = new Arrangement();
c2c2017.id = '1';
c2c2017.aarstall = 2017;

const arrangementer = [c2c2017];

const puber = [];

(function() {

    let pubObjekter = [{navn: "Galgeberg Corner"}, {navn: "Times Bar"}, {navn: "Café Cito"}];

    pubObjekter.forEach((pubObj, idx) => {
        let pub = new Pub();
        pub.navn = pubObj.navn;
        pub.id = idx + 1;
        puber.push(pub);
    });

})();

const personer = ["Vidar", "Tom", "Anders"].map((navn, idx) => {
    let person = new Person();
    person.navn = navn;
    person.id = idx;
    return person;
});

const byIdGetter = function byIdGetter(array) {
    return (id) => array.find(element => element.id === id);
};

export const getPubById = byIdGetter(puber);
export const getPersonById = byIdGetter(personer);
export const getArrangementById = byIdGetter(arrangementer);

export function getPersoner() { return personer;}
export function getArrangement() { return getArrangementById("1")}
