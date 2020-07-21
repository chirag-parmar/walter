import json
import numpy as np
import sys

import plotly.graph_objects as go

def moving_average(a, n=3) :
    ret = np.cumsum(a, dtype=float)
    ret[n:] = ret[n:] - ret[:-n]
    return ret[n - 1:] / n

if len(sys.argv) < 2:
    print("Usage: python3 statistics.py <path_to_dataset>.json")
    print("Options: -m compute moving average of datapoints corresponding to a level")
    exit()

dataset_file = open(sys.argv[1],)

dataset = json.load(dataset_file)

#to create a matrix according to the level of water init a dictionary
dataset_matrix = {}

for datapoint in dataset:

    level = int(datapoint["level"])
    value = int(datapoint["val"])

    if dataset_matrix.get(level) == None:
        dataset_matrix[level] = eval(str(level))
        dataset_matrix[level] = []


    dataset_matrix[level].append(value)

mean_array = []
level_array = []
error_array = []
error_minus_array = []
sd_array = []

for lvl in dataset_matrix:
    if "-m" in sys.argv:
        mean = np.mean(moving_average(dataset_matrix[lvl], 10))
        mean_array.append(mean)
        sd_array.append(np.std(moving_average(dataset_matrix[lvl], 10)))
        error_array.append(np.max(moving_average(dataset_matrix[lvl], 10)) - mean)
        error_minus_array.append(mean - np.min(moving_average(dataset_matrix[lvl], 10)))
    else:
        mean = np.mean(dataset_matrix[lvl])
        mean_array.append(mean)
        sd_array.append(np.std(dataset_matrix[lvl]))
        error_array.append(np.max(dataset_matrix[lvl]) - mean)
        error_minus_array.append(mean - np.min(dataset_matrix[lvl]))

    level_array.append(int(lvl))

#display the graph
fig = go.Figure(data=go.Scatter(
        x=level_array,
        y=mean_array,
        error_y=dict(
            type='data',
            symmetric=False,
            array=error_array,
            arrayminus=error_minus_array
            ),
        xaxis='x',
        yaxis='y'
        ))

fig.update_xaxes(type="linear")
fig.update_yaxes(type="linear")

fig.show()
