import matplotlib.pyplot as plt
import json

# Opening JSON file
f = open('datasets/linear_incremental_filling.json',)

# returns JSON object as
# a dictionary
data = json.load(f)

x = []
y = []
level_lines = []
level_labels = []
level_sums = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0}
level_counts = {"0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0, "11": 0, "12": 0, "13": 0}

prev_level = data[0]["level"]
level_lines.append(data[0]["index"])
level_labels.append(data[0]["level"])

for datapoint in data:

    if datapoint["filling"] == False:
        if datapoint["level"] > prev_level:
            level_lines.append(datapoint["index"])
            level_labels.append(datapoint["level"])

        level_sums[str(datapoint["level"])] = datapoint["val"]
        level_counts[str(datapoint["level"])] += 1

        prev_level = datapoint["level"]
        x.append(datapoint["index"])
        y.append(datapoint["val"])

level_x = []
average_y = []

for lvl in level_sums:
    if level_counts[lvl] != 0:
        level_x.append(lvl)
        average_y.append(level_sums[lvl])


fig, ax = plt.subplots(2)

ax[0].plot(x,y)
ax[0].vlines(x=level_lines, ymin=0, ymax=data[-1]["index"], linestyles="dotted")

ax[0].set(xlabel='x - Time', ylabel='y - Sensor Value')

ax[1].plot(level_x, average_y, marker='o')
ax[1].set(xlabel='x - Level', ylabel='y - Avg. Sensor Value')

fig.suptitle('Linear Incremental Filling')

plt.show()