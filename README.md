## Walter: The Water Butler

### Quick Setup
```bash
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Collect datapoints for experimentation

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
* [ ] Add License file
* [ ] README Documentation
  * [ ] Datasets
  * [ ] Data extraction process
  * [ ] Statistics
* [ ] Calibration Sequence
  * [ ] function for computing the line equation
  * [ ] triggers for interacting with the user
* [ ] Further Experiments
  * [ ] Kalman Filtering
  * [ ] Touch sensing datasets
* [ ] Hardware Improvements
  * [ ] 3D printed case
  * [ ] LEDs & Buttons for eliminating interaction via python scripts
  * [ ] Aluminium or Copper Tape electrodes
  * [ ] Temperature sensor for temperature based calibration
  * [ ] Custom Board with NFC to elimate communication using python scripts
  * [ ] Power supply design
