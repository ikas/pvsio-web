# Car dashboard implementation

## Components
* Speedometer (gauge)
* Fuel (w/ remaining kms?)
* Odometer (km counter) - using BasicDisplay
* Current shift - using BasicDisplay
* Speedometer (absolute value) - using BasicDisplay
* Clock
* Thermometer (environment temperature)
* Tachometer (rotation counter)
* Thermometer (engine temperature)


## Car controls
* **[Arrow Up]** Accelerate
* **[Arrow Down]** Brake

------------

## Implementation phase

The main focus of the implementation phase of this dissertation project will be creating the necessary widgets to simulate a car dashboard.

### Description of the model

![Car dashboard model](https://0.s3.envato.com/files/29882062/Sports%20Car%20Acceleration_590x300.jpg "Car dashboard model")

The image shown above was to chosen to serve as a model of the prototype being developed.
This prototype can be divided in 4 main sets of components: the left circle, the right circle, the central dashboard, and other components.

#### Left circle
The left circle consists of two main components: 
 * *Speedometer gauge*: which shows the current speed of the car in a graphical shape.
 * *Remaining fuel*: also represented graphically by a gauge.

#### Right  circle
The right circle also consists of two main components: 
 * *Tachometer*: a gauge that displays the current rotations of the car 
 * *Engine temperature*: a thermometer also represented by a gauge.

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


## Development process

The implementation of the dashboard was guided by two main goals:

**Reuse as many existing widgets as possible**: In order to avoid code repetition, the first main goal was to reuse the widgets that PVSio-web provides for prototype construction.

**Develop widgets that can later be reused by other PVSio projects**: When building new widgets, the main goal is to make them reusable in future projects.


With these two principles in mind, the components described above will be implemented using the following widgets:

 * Speedometer - Gauge widget (new widget).
 * Remaining fuel display - Gauge widget (new widget).
 * Tachometer - Gauge widget (new widget).
 * Engine temperature - Gauge widget (new widget).
 * Odometer - BasicDisplay (existing widget).
 * Current Gear - BasicDisplay (existing widget).
 * Speedometer (absolute value) - BasicDisplay (existing widget).
 * Three temperature indicators - BasicDisplay (existing widget).
 * Clock - BasicDisplay (existing widget).
 * Environment temperature - BasicDisplay (existing widget).
 * The steering wheel - ?
 * Parking sensors - ?
 * Turning lights - ?


### Implementation of Gauge widget

The first step of development was the implementation of a Gauge widget. The requirements behind the planning of this widget should take into account the 4 components that will be drawn using it.

