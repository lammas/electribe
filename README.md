# electribe

Electribe ESX file format toolkit for Node.js

*Please note that this is still very much a work in progress, so undocumented behavior and bugs should be expected.*

## Install

```sh
npm install electribe
```

## Features and limitations

* Currently only supports the ESX file format
* Supports parsing and editing of all known attributes including pattern and sequence data
* Sample data can be updated with some limitations:
	- numMonoSamples, numStereoSamples and currentSampleOffset need to be updated manually
	- when deleting samples the sample header info must be reset manually
	- when re-saving an existing ESX file's sampledata section the sample locations are not guaranteed to remain the same

## Usage

```javascript
var electribe = require('electribe');
var ESX = electribe.esx1;

// ... Obtain a Buffer object from reading a file ...
var parsedObject = ESX.parse(buffer);
// ... Change values in parsedObject ...
var esxData = ESX.write(parsedObject, { blocksize: 1024 * 1024 * 2 });
// ... Write esxData to a file ...
```

## Credits

* Insight into the data layout was mostly gained from ([open-electribe-editor](https://github.com/skratchdot/open-electribe-editor/)) by @skratchdot
* The rest was reverse engineered from ESX1midiimp.txt document from korg.de
