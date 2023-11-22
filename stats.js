let test_arr1 = [1, 2, 10, 4, 3, 6, 7, 8, 9, 5];
let test_arr2 = [2, 4, 6, 7, 2, 5, 8, 1, 9, 11];
let test_arr3 = [9, 5, 3, 1, 4, 7, 10, 8, 2, 3];

let test_matrix1 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

let test_matrix2 = [
  [1, 2],
  [3, 4],
  [5, 6]
];

let A1 = [
  [1, 0, 1, 2],
  [0, 1, -2, 0],
  [1, 2, -1, 0],
  [2, 1, 3, -2]
]

let B1 = [
  [6],
  [-3],
  [-2],
  [0]
]

let A2 = [
  [-8, 7, 9, -6, -5],
  [-1, 4, 1, 4, 5],
  [2, 9, -4, 1, 7],
  [-4, -1, -8, 8, -3],
  [6, -2, -1, 2, 3]
]

let B2 = [
  [-3],
  [13],
  [15],
  [-8],
  [8]
]

let test_X = [100, 200, 300, 400, 500, 600, 700];
let test_Y = [40, 50, 50, 70, 65, 65, 80];
let test_Z = [10, 20, 10, 30, 20, 20, 30]


class DescrStats {
  constructor (arr) {
    this.orig = arr;
    this.sorted = arr.slice(0).sort((a, b) => {
      return a - b
    });
    this.var = 0;
    this.count = this.sorted.length;
    this.min = this.sorted[0];
    this.max = this.sorted[this.count - 1];
    this.range = this.max - this.min;
    this.sum = 0;
    if (this.count % 2 === 0) {
      this.median = (this.sorted[(this.count / 2) - 1] + this.sorted[this.count / 2]) / 2;
    } else {
      this.median = this.sorted[Math.ceil(this.count / 2) - 1];
    }
    for (let element of this.sorted) {
      this.sum += element;
    }
    this.mean = this.sum / this.count;
    for (let element of this.sorted) {
      this.var += Math.pow(element - this.mean, 2);
    }
    this.var = this.var / this.count;
    this.stdev = Math.sqrt(this.var);
  }
}

class Covar {
  constructor (arr1, arr2) {
    this.arr1 = new DescrStats(arr1);
    this.arr2 = new DescrStats(arr2);
    this.covar = 0;
    for (let i = 0; i < this.arr1.count; i++) {
      this.covar += (arr1[i] - this.arr1.mean)*(arr2[i] - this.arr2.mean);
    }
    this.covar = this.covar / (this.arr1.count - 1);
    this.corr = this.covar / (Math.sqrt(this.arr1.var) * Math.sqrt(this.arr2.var));
  }
}

class CorrMatrix {
  constructor (...args) {
    let n = args.length;
    let obs = args[0].length;
    this.matrix = Array(n).fill().map(() => {
      return Array(n).fill(0)
    })
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let corr = new Covar (args[i], args[j]);
        this.matrix[i][j] = corr.corr;
      }
    }
  }
}

class MultMatrices {
  constructor (matrix1, matrix2) {
    this.matrix1 = matrix1.slice(0);
    this.matrix2 = matrix2.slice(0);
    this.resultRows = this.matrix1.length;
    this.resultCols = this.matrix2[0].length;
    // this.result = Array(this.matrix1Stats.count).fill().map(() => {
    this.result = Array(this.resultRows).fill().map(() => {
      return Array(this.resultCols).fill(0);
    })
    console.log(this.result);
    for (let i = 0; i < this.resultRows; i++) {
      for (let j = 0; j < this.resultCols; j++) {
        for (let k = 0; k < this.resultRows; k++ ) {
          this.result[i][j] += matrix1[i][k] * matrix2[k][j];
        }
      }
    }
  }
}

class TransposeMatrix {
  constructor (matrix) {
    this.resultRows = matrix[0].length;
    this.resultCols = matrix.length;
    this.result = Array(this.resultRows).fill().map(() => {
      return Array(this.resultCols).fill(0);
    })
  }

}

class InvertMatrix {
  constructor (matrix) {

  }
}

// Ordinary Least Squares
class OLS {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.xStats = new DescrStats(x);
    this.yStats = new DescrStats(y);
    this.b = this.yStats.mean;
    this.m = 0;
    let sum_x_squared = 0;
    for (let i = 0; i < this.xStats.count; i++) {
      this.m += (x[i] - this.xStats.mean) * y[i];
      // this.m += (x[i] - this.xStats.mean) * (y[i] - this.yStats.mean);
      sum_x_squared += Math.pow(x[i] - this.xStats.mean, 2);
    }
    this.m = this.m / sum_x_squared;
    this.b -= this.m * this.xStats.mean;
    this.residuals = [];
    this.predicted = [];
    for (let i = 0; i < this.yStats.count; i++) {
      this.predicted[i] = this.m * x[i] + this.b
      this.residuals[i] = y[i] - this.predicted[i]
    }
    let residualAnalysis = new DescrStats(this.residuals)
    this.errorVar = residualAnalysis.var * (residualAnalysis.count - 1) / (residualAnalysis.count - 2);
    this.mStandardError = Math.sqrt(this.errorVar) / Math.sqrt(sum_x_squared);
    this.mTstat = this.m / this.mStandardError;
  }
}

// LU Decomposition
class LUDcomp {
  constructor (matrixA, matrixB) {
    this.A = matrixA.slice();
    this.B = matrixB.slice();
    let n = matrixA.length;
    this.L = Array(n).fill().map(() => {
      return Array(n).fill(0);
    })
    this.U = Array(n).fill().map(() => {
      return Array(n).fill(0);
    })
    // find first row of upper matrix and first column on lower matrix
    for (let i = 0; i < n; i++) {
      this.L[i][i] += 1;
      this.U[0][i] += this.A[0][i];
      if (i !== 0) {
        this.L[i][0] = this.A[i][0] / this.U[0][0]
      }
    }
    for (let i = 1; i < n; i++) {
      for (let j = 1; j < n; j++) {
        let temp = 0;
        for (let k = 0; k < n; k++) {
          temp += this.L[i][k] * this.U[k][j]
        }
        if (j - i >= 0) {
          // solve for upper when j - i >= 0
          if (i === j) {
            // divisor is this.L[i][j] when on the diagonal
            this.U[i][j] = (this.A[i][j] - temp) / this.L[i][j];
          } else {
            // divisor shifts when off the diagonal
            this.U[i][j] = (this.A[i][j] - temp) / this.L[i][i];
          }
        } else {
          // solve for lower when j - i < 0
          if (i === j) {
            // divisor is this.U[i][j] when on the diagonal
            this.L[i][j] = (this.A[i][j] - temp) / this.U[i][j];
          } else {
            // divisor shifts when off the diagonal
            this.L[i][j] = (this.A[i][j] - temp) / this.U[j][j];
          }
        }
      }
    }
    // AX = B; A is factored into LU; LUX = B; let UX = Y sucht that LY = B:
    // now solve for this.Y
    this.Y = Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      let temp = 0
      for (let j = 0; j < n; j++) {
        temp += this.Y[j] * this.L[i][j];
      }
      this.Y[i] = temp;
      this.Y[i] = this.B[i] - this.Y[i];
    }
    // Now, UX = Y and X can be solved similarly
    this.X = Array(n).fill(0)
    for (let i = n - 1; i >= 0; i--) {
      let temp = 0
      for (let j = 0; j < n; j++) {
        temp += this.X[j] * this.U[i][j];
      }
      this.X[i] = (this.Y[i] - temp) / this.U[i][i];
    }
  }
}

class MultiVariateRegression {
  constructor (...data) {
    // deep copy of sample data
    let n = data.length;
    this.obs = data[0].length;
    this.data = Array(n).fill().map((value, index) => {
      return data[index].slice();
    })
    this.coefficients = Array(n).fill(0);
    this.coefficientVariances = Array(n).fill(0);
    this.coefficientStandardErrors = Array(n).fill(0);
    this.responseVar = new DescrStats(this.data[0]);
    this.coefficients[0] = this.responseVar.mean;
    this.sampleData = {};
    for (let i = 1; i < n; i++) {
      this.sampleData[i] = new DescrStats(this.data[i]);
    }
    // setup simulataneous equations to solve for remaining coefficients
    this.B = Array(n - 1).fill(0);
    // translate sample data into deviations from its mean & populate this.B
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] -= this.sampleData[i].mean;
        this.B[i - 1] += this.responseVar.orig[j] * this.data[i][j];
      }
    }
    this.A = Array(n - 1).fill().map(() => {
      return Array(n - 1).fill(0);
    })
    console.log(this.A)
    // populate this.A
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        for (let k = 0; k < this.data[i].length; k++) {
          this.A[i][j] += this.data[i + 1][k] * this.data[j + 1][k];
        }
      }
    }
    // using this.A and this.B, solve simultaneous equations to find coefficients
    this.X = new LUDcomp(this.A, this.B).X;
    for (let i = 1; i < this.coefficients.length; i++) {
      this.coefficients[i] = this.X[i - 1];
    }
    // retranslate back into original frame of reference
    for (let i = 1; i < n; i++) {
      this.coefficients[0] -= this.sampleData[i].mean * this.coefficients[i];
    }
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < this.data[i].length; j++) {
        this.data[i][j] += this.sampleData[i].mean;
      }
    }
    // compute RSME
    this.predicted = Array(this.obs).fill(this.coefficients[0]);
    this.residuals = Array(this.obs).fill(0);
    this.resAboutAvg = Array(this.obs).fill(this.responseVar.mean);
    // residual sum of squares
    this.rss = 0;
    // totla sum of squares about the average of the dependent variable
    this.tss = 0;
    // traverse independent variables
    for (let i = 1; i < n; i++) {
      // traverse observations
      for (let j = 0; j < this.data[i].length; j++) {
        // multiple value of observed independent variable by computed coefficients
        this.predicted[j] += this.coefficients[i] * this.data[i][j];
      }
    }
    for (let i = 0; i < this.obs; i++) {
      this.residuals[i] = this.data[0][i] - this.predicted[i];
      this.resAboutAvg[i] -= this.data[0][i];
      this.rss += this.residuals[i]**2;
      this.tss += this.resAboutAvg[i]**2;
    }
    this.dfRegression = n - 1;  // number of independent variables
    this.dfResidual = this.obs - this.coefficients.length; // number of observation minus number of variables (i.e. coefficients) estimated
    // natural estimator of the variance of the dependent variable population is derived from the sample
    // the above estimator is biased low, therefore dfResidual (small than number of observations) serves as a bias correction
    this.popVarEst = this.rss / (this.dfResidual);
    this.popStdEst = Math.sqrt(this.popVarEst);
    this.rmse = Math.sqrt(this.rss / this.dfResidual);
    this.rSquared = 1 - (this.rss / this.tss);
    this.rAdjSquared = 1 - (this.rss/(this.obs - n)) / (this.tss/(this.obs - 1));
    // compute standard error for each of the coefficients
    // ASSUMPTION:  Independent variables are uncorrelated
    let temp = 0
    for (let i = 1; i < n; i++) {
      temp += (this.sampleData[i].mean ** 2) / this.sampleData[i].var;
    }
    this.coefficientVariances[0] = (this.popVarEst / this.obs) * (1 + temp);
    this.coefficientStandardErrors[0] = Math.sqrt(this.coefficientVariances[0])
    for (let i = 1; i < n; i++) {
      temp = 0;
      for (let j = 0; j < this.data[i].length; j++) {
        temp += Math.pow(this.data[i][j] - this.sampleData[i].mean, 2);
      }
      this.coefficientVariances[i] = this.popVarEst / temp;
      this.coefficientStandardErrors[i] = Math.sqrt(this.coefficientVariances[i]);
    }
    this.constMatrix = Array(this.dfRegression).fill().map(() => {
      return Array(this.dfRegression).fill(0);
    })
    for (let i = 0; i < this.dfRegression; i++)  {
      for (let j = 0; j < this.dfRegression; j++) {
        for (let k = 0; k < this.obs; k++) {
          this.constMatrix[i][j] +=  this.data[i + 1][k] * this.data[j + 1][k];
        }
        this.constMatrix[i][j] = this.constMatrix[i][j] ** 2;  // only if  covariance of coefficient is assumed zero
      }
    }
    this.zeroMatrix = Array(this.dfRegression).fill(0)
    this.varMatrix = new LUDcomp(this.constMatrix, this.zeroMatrix).X;
  }
}

// let testDescStats = new DescrStats(test_arr3);
// console.log(testDescStats);

// let testCovar = new Covar (test_arr1, test_arr2);
// console.log(testCovar);

// let testMult = new MultMatrices(test_matrix1, test_matrix2);
// console.log(testMult);

// let testOLS = new OLS(test_X,test_Y);
// console.log(testOLS);

// let testLUDcomp1 = new LUDcomp(A1, B1);
// console.log(testLUDcomp1);

// let testLUDcomp2 = new LUDcomp(A2, B2);
// console.log(testLUDcomp2);

// let testMVR1 = new MultiVariateRegression(test_Y, test_X, test_Z);
// console.log(testMVR1);

// let testMVR2 = new MultiVariateRegression(test_Y, test_X);
// console.log(testMVR2);

// let testCorr = new CorrMatrix(test_arr1, test_arr2, test_arr3);
// console.log(testCorr);

let testTranspose = new TransposeMatrix(test_matrix2);
console.log(testTranspose);