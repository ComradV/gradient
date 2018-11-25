

let precision = 0.01;

// pdf returns the probability density function
// It is a function of the number of sentences
// away from central indicator.

// function pdf(s, precision) {
//     let k = Math.sqrt(precision / 2 / Math.PI)
//     let p = -precision * s * s / 2
//     return k * Math.exp(p);
// }

        // createTable returns a pdf table, where s ranges
        // from -L to L. resolution is the number of equally
        // spaced gaps.
        // function createTable_1(L, resolution, scale) {

        //     var out = []
        //     let gap = 2 * L / resolution

        //     let highest = 0

        //     for (let s = -L; s < L; s = s + gap) {
        //         let val = pdf(s, precision)
        //         if (val > highest) {
        //             highest = val
        //         }
        //         out.push(val)
        //     }

        //     // Scale values
        //     out.forEach(function (v, i) {
        //         out[i] = v / highest * scale;
        //     });

        //     return out
        // }


        // let x = createTable_1(10, 100, 1.0)
        // console.log('z', x)


// NO jQuery
// Set scale factor

// factorial returns the factorial of num
function factorial(num) {
    var rval = 1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

// C returns the binomial coefficient.
// See: https://en.wikipedia.org/wiki/Binomial_distribution
function C(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k))
}

// pmf returns the probability mass function. 
function pmf(n, k) {
    let p = 0.5
    return C(n, k) * Math.pow(p, n)
}


