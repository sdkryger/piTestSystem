# piTestSystem
Raspberry Pi based data logging and test rig control with interface via web browser. 

# System overview
This system provides a user interface via a web server. The intention is to have the Raspberry Pi talk to a separate PLC via Modbus Ethernet to allow for 'industrial' input/output.

# Development state
- Implement basic web server using Flask (Python) - Complete
- Splash screen with 3D rotating logo - Complete
- Graph updated via AJAX - Complete
- Settings page to add/update/delete channels - Complete
- Separate thread to interface with hardware inputs/outputs - Complete
- File logging
- Download of log files
- Display of log file
- Set output state based on input conditions (example: shut off heater power when temperature is too high)
- Hardware input/output thread to interface with real-world hardware
- Heartbeat from Raspberry Pi to input/output hardware (shut off outputs if heartbeat stops)

