```
1+2
2*(3+1)
2*3+1
2.5*2
$this.value * 2
UPPERCASE($this.value)
$this.unit
${Breite}.value * ${Laenge}.value
``` 
# MAP(value, mapping, deactivateAction?, default?)
```
MAP($this.value, { "Betonqualität": "Betongüte", "Nagel": "Stahlstift" }, ["Ignore", "Ignorieren"], "Defaultwert")
MAP($this.value, 
    [ 
        [ { stringValue:"Betonqualität" }, { stringValue :  "Betongüte" } ], 
        [ { stringValue: "Nagel"}, {stringValue: "Stahlstift" } ]
    ],
    ["Ignore", "Ignorieren"], "Defaultwert")
MAP($this.value, 
    [ 
        [ @urn:uuid:2342342345, @urn:uuid:asdfasdf343w],
        [ @urn:uuid:234523452345542345256": @urn:uuid:sfvqaq]
    ], 
    ["Ignore", "Ignorieren"], @urn:uuid:sfvq34easdfasdq)
```

Frage: wie die typinformation vom client in die / aus der expression übertragen. Typed value wäre eine Möglichkeit.

$PROP@value // 1.5, "some text", [1.5, 1.2], [[1,2],[3,4]]
$PROP // (shorthand) 1.5, "some text", [1.5, 1.2], [[1,2],[3,4]]
$PROP@name // "breite in mm"
$ELEM@name // "vierte wand von links"
$ELEM@guid // "3245-34-2345asdwersdfhasd"
$ELEM.{breite in mm}@value
$ELEM.{1234-afed-43334-facde}@value
$ELEM.{breite in mm}@name
$PROP.elem@name //"vierte wand von links"
$PROP.pset@name //"STRABAG"


