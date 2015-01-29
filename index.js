function printTree(obj, opts) {
    var options = opts || {},
        depth = options.depth || 0, // depth = 0 - no limits
        short = options.short,  // short = 1 - print only property names
        qtyIndent = options.indent || 2,
        indentSymbol = Array(qtyIndent + 1).join(' '),
        chars = {
            hr: '├───',
            node: '├',
            lastNode: '└',
            indent: indentSymbol
        },

        cache = [],
        print = console.log.bind(console);

    walk(obj, 0, []);

    function walk(obj, dep, parents) {
        if(
            !isObject(obj) ||
            (depth && dep > depth)
        ){
            return;
        }
        var keysLength = Object.keys(obj).length;
        cache.push(obj);    // es6 => weakmap ?

        Object.keys(obj).forEach(function(key, i) {
            var indent = Array(dep+1).join('|').split(''),
                isLast = (i === keysLength - 1),
                val = obj[key],
                circular,
                res;

            parents.forEach(function(index){
                indent[index] = ' '
            });

            indent.push(isLast ? chars.lastNode : chars.node, key);

            if(isObject(val)){
                if(cache.indexOf(val) > -1){
                    circular = true;
                    indent.push('[Circular]');
                }
            }

            res = indent.join(chars.indent);

            if(circular){
                print(res);
                return;
            }

            if(!short && !isObject(val)){
                res += ': ';
                if(isArray(val)){
                    res += '['+val.toString()+']'

                } else {
                    res += val
                }
            }

            print(res);

            if(isObject(val)) {
                walk(val, dep + 1, isLast ? parents.concat(dep) : parents);
            }

            if(isArray(val)) {
                val.forEach(function(item){
                    walk(item, dep + 1, isLast ? parents.concat(dep) : parents);
                })
            }
        });
    }

    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]'
    }

    function isArray(obj) {
        return obj instanceof Array;
    }

}

if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = printTree;
}
