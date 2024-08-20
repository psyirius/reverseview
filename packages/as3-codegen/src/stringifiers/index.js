import Program from './program.js'
import ImportDeclaration from './import-decl.js'
import ClassDeclaration from './class-decl.js'
import MethodDeclaration from './method-decl.js'
import ExpressionStatement from './expr-stmt.js'
import CallExpression from './call-expr.js'
import Identifier from "./identifier.js";
import TypeReference from "./type-ref.js";
import Namespace from "./namespace.js";
import Keyword from "./keyword.js";
import Literal from "./literal.js";

export default {
    Program,
    Keyword,
    Literal,
    Namespace,
    Identifier,
    TypeReference,
    ImportDeclaration,
    ClassDeclaration,
    MethodDeclaration,
    ExpressionStatement,
    CallExpression,
}