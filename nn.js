
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(x) {
    return x * ( 1 - x );
}

class nn_layer {
    constructor(inputs, outputs) {
        this.weights = new Matrix(inputs, outputs);
        this.biases = new Matrix(1, outputs);

        this.learning_rate = 0.1;
    }

    feedforward(m2) {
        this.inputs = m2;

        this.outputs = Matrix
            .multiply(this.weights, m2)
            .sum(this.biases)
            .map(sigmoid);

        return this.outputs;
    }

    train(errors) {
        let gradients = Matrix.map(this.outputs, dsigmoid);
        gradients.hadamard_multiply(errors);
        gradients.multiply(this.learning_rate);

        let inputs_t = Matrix.transpose(this.inputs);
        let deltas = Matrix.multiply(gradients, inputs_t);

        this.weights.sum(deltas);
        this.biases.sum(gradients);

        // Calculate the hidden layer errors
        let weights_t = Matrix.transpose(this.weights);
        let wt_errors = Matrix.multiply(weights_t, errors);

        return wt_errors;
    }

    static fromJSON(data) {
        let layer = new nn_layer();
        layer.weights = Matrix.fromArray(data.weights);
        layer.biases = Matrix.fromArray(data.biases);

        return layer;
    }

    asJSON() {
        return {
            weights: this.weights.toArray(),
            biases: this.biases.toArray()
        }
    }
}

class nn {
    constructor(inputs, outputs, hidden_layers) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.hidden_layers = hidden_layers;

        this.layers = [];
        if(!hidden_layers) hidden_layers = [];

        let last_output = inputs;
        for (let hl of hidden_layers) {
            this.layers.push(new nn_layer(last_output, hl));
            last_output = hl;
        }

        this.layers.push(new nn_layer(last_output, outputs));
    }

    feedforward(inputs) {
        let last_output = Matrix.fromArray([inputs]).transpose();
        for (let layer of this.layers) {
            last_output = layer.feedforward(last_output);
        }
        return Matrix.transpose(last_output).toArray()[0];
    }

    static fromJSON(data) {
        let tmp = new nn(data.inputs, data.outputs, data.hidden_layers);

        let layers = []
        for (let layer of data.data) {
            layers.push(nn_layer.fromJSON(layer));
        }
        tmp.layers = layers;

        return tmp;
    }

    asJSON() {
        let data = [];
        for (let layer of this.layers) {
            data.push(layer.asJSON());
        }
        return {
            inputs: this.inputs,
            outputs: this.outputs,
            hidden_layers: this.hidden_layers,
            data: data
        };
    }

    train(inputs, targets) {
        targets = Matrix.fromArray([targets]).transpose();
        let outputs = this.feedforward(inputs);
        outputs = Matrix.fromArray([outputs]).transpose();

        let error = Matrix.sub(targets, outputs);

        for (var i = this.layers.length - 1; i >= 0; i--) {
            error = this.layers[i].train(error);
        }
        return error;
    }
}
