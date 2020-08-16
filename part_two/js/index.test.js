var $ = require('./jquery.min')(window);
const index = require('./index');
const jq = require('./jquery.min');
const materialize = require('./materialize.min');

test("Test user must have a name between 2 and 30 alphabet characters",()=>{//Test name validation
    expect(index.validName("a")).toEqual(false);//1 letter is too short for a name
    expect(index.validName("aa")).toEqual(true);//2 letters is just long enough to be a name
    expect(index.validName("Michael")).toEqual(true);//standard 7 letter name should be okay
    expect(index.validName("a1")).toEqual(false);//name should not contain a number
    expect(index.validName("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(true);//test 30 character limit for name
    expect(index.validName("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(false);//31 characters is too long for a name
});

test('Test user cannot supply an invalid email address', ()=> {//Test email validation
    expect(index.validEmail("notAValidEmail")).toEqual(false);//no @ or .
    expect(index.validEmail("a@a.a")).toEqual(false);//too short
    expect(index.validEmail("a@a.aa")).toEqual(true);//just enough to pass validity
    expect(index.validEmail("aaa.aa")).toEqual(false);//no @
    expect(index.validEmail("a@aaaa")).toEqual(false);//no .
});

test("Test user's password must contain 1 capital, 1 symbol, 1 number, 1 lower case, and be 6-60 chars",()=>{
    expect(index.validPassword("P@s5w0")).toEqual(true);//6 char minimum including required char types
    expect(index.validPassword("P@s5w0rd")).toEqual(true);// 8 char test including required char types
    expect(index.validPassword("P@s5")).toEqual(false);//too short
    expect(index.validPassword("P@s5aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(true);//Test 60 char limit for password
    expect(index.validPassword("P@s5aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(false);//61 chars - too long
    expect(index.validPassword("P@ssword")).toEqual(false);// 8 char test but missing number
    expect(index.validPassword("Passw0rd")).toEqual(false);// 8 char test but missing symbol
    expect(index.validPassword("pa$sw0rd")).toEqual(false);// 8 char test but missing capital
    /*Initially this above test failed as my password validation regex did not adequately check for a minimum of 1 capital */
    expect(index.validPassword("P@5SWORD")).toEqual(false);// 8 char test but missing lower case
});

test("Test user must be over 18", ()=>{
    expect(index.validDoB(1900,0,0)).toEqual(true);//user born in 1900 is over 18
    expect(index.validDoB(3000,0,0)).toEqual(false);//user born in 3000 is under 18 - test will need updated in 980 years
});