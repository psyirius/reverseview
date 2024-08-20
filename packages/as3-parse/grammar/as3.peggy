Program "program"
  = Package / Namespace

Package "package"
  = "package" _ name:PackageName? _ body:ProgramBody _ EOI {
    return { type: 'package', name, body }
  }

Namespace "namespace"
  = "namespace" _ name:PackageName _ "{" _ body:ProgramBody _ "}" _ EOI {
    return { type: 'namespace', name, body }
  }

PackageName "package name"
  = base:Identifier rest:("." Identifier)* {
    return base + rest.map((r) => r.join('')).join('')
  }

ProgramBody "program body"
  = "{" _ statements:((Import | Class) _)* _ "}" {
    return { statements }
  }

Class "class"
  = "class" _ name:Identifier _ "{" _ "}" {
    return { type: 'class', name }
  }

Import "import"
  = "import" _ name:PackageName _ (EOS*)? {
    return { type: 'import', name }
  }

Identifier "identifier"
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_]* {
    return first + rest.join('')
  }

EOI "end of input"
  = !.

EOS "end of statement"
  = sc / nl

sc "semicolon"
  = ";"

nl "newline"
  = [\n\r]

_ "whitespace"
  = [ \t\n\r]*