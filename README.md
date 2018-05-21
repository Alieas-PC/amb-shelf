# Prerequisties
## Hardware
  See <https://github.com/garrett-davidson/pimiibo#hardware>
  Follow the instruction mentioned in README.
## Software environment
  The LTS version of nodejs installed.

---------------
# 
# Change the values of the config attribute in the package.json according to your environment.
## config properties:
  - amiiBinDirPath: where your amiibo bin files place in, based on this app directory.
  - makingProgram: where the pimiibo executable file place in, based on this app directory.
  - cwd: pimiibo directory, **MUST BE SET CORRECTLY** otherwise the making task dont start correctly.
  - keyPath: where the Nintendo key file place in, based on this app directory.

# Steps
  1. Clone this repo and cd into it.
  2. Run `npm install && npm start`.
  3. You're done, try visit it via `http://localhost:3000` in your browser.
