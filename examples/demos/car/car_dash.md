# Car dashboard model

### Components
* Speedometer (gauge)
* Fuel (w/ remaining kms?)
* Odometer (km counter) - using BasicDisplay
* Current shift - using BasicDisplay
* Speedometer (absolute value) - using BasicDisplay
* Clock
* Thermometer (environment temperature)
* Tachometer (rotation counter)
* Thermometer (engine temperature)


### Car controls
* **[Arrow Up]** Accelerate
* **[Arrow Down]** Brake




## Implementation phase

The main focus of the implementation phase of this dissertation project will be creating the necessary widgets to simulate a car dashboard.

### Description of the model

![Car dashboard model](https://0.s3.envato.com/files/29882062/Sports%20Car%20Acceleration_590x300.jpg "Car dashboard model")

The image shown above was to chosen to serve as a model of the prototype being developed.
This prototype can be divided in 3 main sets of components: the left circle, the right circle, and the central dashboard.

#### Left circle
The left circle consists of two main components: a *speedometer gauge* - which shows the current speed of the car in a graphical shape - and the *remaining fuel of the car* - also represented graphically by a gauge.

#### Right  circle
The right circle also consists of two main components: a *tachometer* - a gauge that displays the current rotations of the car - and the *engine temperature* - a thermometer also represented by a gauge.

#### Central dashboard
The central dashboard is composed by several components:
 * *Odometer*: displays the distance (in kilometers) the car has ever travelled.
 * *Current Gear*: displays the current gear of the car.
 * *Speedometer (absolute value)*: displays the current speed of the car as an absolute value.
 * *Three temperature indicators*: Three thermoters that display important car temperatures (TODO change this !!).
 * *Clock*: a clock showing the current time in hours and minutes.
 * *Environment temperature*: An indicator of the current environment temperature.

#### Other dashboard components
There are also some dashboard components aside the ones described and grouped above:
* *The steering wheel*: The steering wheel allows to change the direction of the car.
* *Parking sensors*: The parking sensors display the proximity of a car with an obstacle.
* *Turning lights*: Displays the turning lights of the car - if they have been activated.
