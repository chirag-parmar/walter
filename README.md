## Walter: The Water Butler

### The Science of Walter

The primary design goal of this project is to use a non-intrusive sensor to avoid contamination of potable water. Therefore, we use a DIY capacitance based sensor and to keep it simple we go with parallel plate design. The two plates are made of aluminium foil and are fixed to the outside wall of the bottle. To create a mathematical model let's start with the famous capacitance equation shown below.

![parallel_plate_cap](docs/parallel_plate_cap.gif)

Since the combined dielectric constant would be a function of the height of the water we can simply measure the capacitance and deduce the height of the water. Easy-peazy lemon-squeazy, just that it is not that easy.

The first complexity is that we cannot model it as a parallel plate capacitor. Simply because the plates are not parallel, in other words, the distance between the plates is not constant it varies along the shorter edge of the plate.

![parallel_curvature_cap](docs/parallel_curvature_cap.png)

The second complexity is that the electrical conductivity of water also has a role to play in the increase of capacitance. Potable water even though being "bad" is a conductor (unless you are drinking distilled water). Due to this the water acts like a "bad" conducting metal slab between our capacitor. Due to this the effective capacitor circuit is equivalent to two capacitors connected in series with a high reistance between them. Watch [this](https://www.youtube.com/watch?v=ygADYZEBmtc) video to know why.

![effective_capacitance](docs/effective_capacitance.png)

Therefore, in addition to factoring in a "varying" `d` we would also have to factor in the effect of water as a bad conductor(the electrical conductivity) along with the effect of dielectric constant. One cannot get tangled into the physics of things while playing the role of a hobbyist (one can actually, but one is planning not to. XD). So we just move forward by considering it to be a blackbox and use analytical methods to find the relation between the capacitance and the level of water.

### Quick Setup
```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

### How to collect datapoints for experimentation?

*TODO*

### View statistics

```bash
python3 statistics.py datasets/<name_of_json_dataset>
```

Example:
```bash
python3 statistics.py datasets/linear_incremental_filling.json
```

### Circuit Diagram
![walter_circuit](docs/walter_circuit.png)

### Images
![walter_arduino_brain](docs/walter_arduino_brain.jpeg)
![walter_calibration_scale](docs/walter_calibration_scale.jpeg)

#### TODO:
* [x] Add License file
* [ ] README Documentation
  * [ ] Datasets
  * [ ] Data extraction process
  * [ ] Statistics
  * [x] The science of walter
* [ ] Calibration Sequence
  * [ ] function for computing the line equation
  * [ ] triggers for interacting with the user
* [ ] Further Experiments
  * [x] moving average filter (first tried with pythons scripts (`python3 statistics.py <dataset_path> -m`) and then updated the arduino code `Walter_Filtered`)
  * [ ] Kalman Filtering
  * [ ] Touch sensing datasets
* [ ] Hardware Improvements
  * [ ] 3D printed case
  * [ ] LEDs & Buttons for eliminating interaction via python scripts
  * [ ] Aluminium or Copper Tape electrodes
  * [ ] Temperature sensor for temperature based calibration
  * [ ] Custom Board with NFC to elimate communication using python scripts
  * [ ] Power supply design
