```
==
!=
<
>
=>
<=
CONTAINS(input, searchstring, ignoreCase)
MATCHES(input, pattern, ignoreCase)
CONTAINSREGEX(input, pattern, ignoreCase)
MATCHESREGEX(input, pattern, ignoreCase)
EXISTS



VALUE(PROPERTY(PROPERTY_SET(ELEMENT(), "STRABAG"), "breite"))
$element.propertySet("STRABAG").property("breite").value()

REPLACE($property.value(),"_","/")
REPLACE(VALUE(PROPERTY()),"_","/)
$property.value().replace("_","/")

"C25/30".replace("/","_")

1.224.round(2)
1.224.ROUND(2)

PROPERTY_SET(ELEMENT(), "STRABAG").property("breite").value()


NAME(PROPERTY())
$property.name()

GUID(ELEMENT())
$element.guid()

IFCCLASS(ELEMENT())
UNIT(PROPERTY())

```
