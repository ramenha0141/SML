# SML Compiler Version1.0
SML(Syntax Markup Language) is a language for writing Parser.
## Compiler Command Parameter
`sml <input-file-path> [-i <include-file-path>] [-o <output-file-path]`

`<input-file-path>` : File path to syntax file.
`-i <include-file-path>` (Optional) : File path to include file.

`-o <output-file-path>` (Optional) : File path to output file. (If this option is not set, '<input-file-name>.js' will be set by default)
## Syntax
```
  a = 'a'; //define a is match to 'a'
  b = a 'b'; //define b is match to 'a' 'b'
  c = b 'c'; //define c is match to 'a' 'b' 'c'
  
  fruit = 'apple' | 'banana' | 'orange'; //define fruit is match to 'apple' or 'banana' or 'orange'
  
  d = 'd' ['e']; //define d is match to 'd' or 'd' 'e'
  
  e = {'e'}; //define e is match to 'e' or 'ee' or 'eee' or 'eeee' ......
  
  f = 'f' ('g' | 'i'); //define f is match to 'f' 'g' or 'f' 'i'
```
