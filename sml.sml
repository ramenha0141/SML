sml = define {';' define};
define = identifier '=' expression;
expression = element {'|' element};
element = { str_s
          | str_d
          | identifier
          | '(' expression ')'
          | '[' expression ']'
          | '{' expression '}'};