# Walter: Proof of Concept

> The proof of concept is done using arduino uno. The .ino files can be found in the `arduino` folder.

## The Science of Walter

The primary design goal of this project is to use a non-intrusive sensor to avoid contamination of potable water. Therefore, we use a DIY capacitance based sensor and to keep it simple we go with parallel plate design. The two plates are made of aluminium foil and are fixed to the outside wall of the bottle. To create a mathematical model let's start with the famous capacitance equation shown below.

![parallel_plate_cap](parallel_plate_cap.gif)

Since the combined dielectric constant would be a function of the height of the water we can simply measure the capacitance and deduce the height of the water. Easy-peazy lemon-squeazy, just that it is not that easy.

The first complexity is that we cannot model it as a parallel plate capacitor. Simply because the plates are not parallel, in other words, the distance between the plates is not constant it varies along the shorter edge of the plate.

![parallel_curvature_cap](parallel_curvature_cap.png)

The second complexity is that the electrical conductivity of water also has a role to play in the increase of capacitance. Potable water even though being "bad" is a conductor (unless you are drinking distilled water). Due to this the water acts like a "bad" conducting metal slab between our capacitor. Due to this the effective capacitor circuit is equivalent to two capacitors connected in series with a high reistance between them. Watch [this](https://www.youtube.com/watch?v=ygADYZEBmtc) video to know why.

![effective_capacitance](effective_capacitance.png)

Therefore, in addition to factoring in a "varying" `d` we would also have to factor in the effect of water as a bad conductor(the electrical conductivity) along with the effect of dielectric constant. One cannot get tangled into the physics of things while playing the role of a hobbyist (one can actually, but one is planning not to. XD). So we just move forward by considering it to be a blackbox and use analytical methods to find the relation between the capacitance and the level of water.

## The Analytics of Walter

#### Quick Setup:
```bash
virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
```

#### Collecting Datapoints:

![walter_calibration_scale](walter_calibration_scale.jpg)

```bash
python3 scripts/create_dataset.py
```

This python script runs a infinite loop while asking the user two questions in every iteration fo the loop.

1. "Enter number of datapoints to collect(q/Q - quit): " - this is where the user can specify the number of datapoints to be collected or type in `q` or `Q` to quit.
2. "Enter the level of water: " - The water level entered here will be used for all the datapoints that were specified in the question above.

Each datapoint is stored as JSON string as shown below and each dataset is a `List` of datapoints.

```json
{
  "index": 0,
  "val": 742,
  "level": 0,
}
```

* `index` (*self-explanatory*)automatically incremented for every new datapoint.
* `val` represents the sensor value.
* `level` marks the level of water.

This repository has two pre-existing datasets,
1. `linear_filling` - datapoints are collected starting from `level 0` and linearly incrementing thereafter upto `level 13`.
2. `exponential_filling` datapoints are collected starting from `level 0` and exponentially incrementing thereafter upto level 13 i.e. at 0, 1, 2, 4, 8, 13

#### Analyzing the data:

```bash
python3 scripts/statistics.py datasets/<name_of_json_dataset>
```

Linear Filling:
![linear_filling_plot](linear_filling_plot.png)
*zoomed in view of `level 6` error bar*
![linear_filling_error](linear_filling_error.png)

Exponential Filling:
![exponential_filling_plot](exponential_filling_plot.png)
*zoomed in view of `level 4` error bar*
![exponential_filling_error](exponential_filling_error.png)

We can deduce the following conclusions of the experiment
1. The sensor value is more or less **linearly** dependent on the level of water.
    * Flattening/breaking of the line after `level 12` of water in the `linear_filling` plot is because level 13 is above the plate area of the capacitor and hence has no or minimal effect on the capacitance.
2. The error in the values is max at +/- 10. This is **super awesome** considering we had to write only a couple of lines of code and solder one resistor to make the sensor.

Further questions to ponder upon:
* Is the linear relationship because of the **uniform** nature of the cylindrical bottle?
* What if the shape of the bottle is not uniform across the cross section of the plates
* Since the relationship is linear can we simply collect two datapoints and compute the line equation? (reaping the benefits of continuity of the realtionship)

## The Touch of Walter

The touch sensing of Walter was an accidental discovery but was not surprising because we are using `CapacitiveSensor` library. This library is majorly used for capacitive `touch` sensing.

So when we open up a up the `serial plotter` provided inside the Arduino IDE and connect Walter via a serial connection we notice that:
1. The sensor value shoots up higher than normal when we touch the bottle.
2. The touch values are higher when the bottle is grabbed tighter.
3. The touch values are higher when the bottle is filled up.

![touch_graph](touch_graph.png)

Since the sensor values are *wayyyyyy* higher than normal values we can check for threshold. Whenever the sensor value is greater than this threshold then we can say that the bottle is touched.

For the above graph a practical threshold value would be `5000` since all the peaks cross that mark and our normal maximum value is close to `3000`(full bottle)

#### Circuit Diagram:
![walter_circuit](walter_circuit.png)

## Images
![walter_arduino_brain](walter_arduino_brain.jpeg)
 