"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function defaultAnalyzerDir() {
  const libraryRoot = process.platform === "darwin"
    ? path.join(os.homedir(), "Music", "Ableton", "User Library")
    : path.join(os.homedir(), "Documents", "Ableton", "User Library");
  return path.join(libraryRoot, "Presets", "Audio Effects", "Max Audio Effect");
}

function analyzerDir() {
  return process.env.LIVEPILOT_ANALYZER_DIR || defaultAnalyzerDir();
}

function filesEqual(source, destination) {
  if (!fs.existsSync(destination)) return false;
  const sourceStat = fs.statSync(source);
  const destinationStat = fs.statSync(destination);
  if (sourceStat.size !== destinationStat.size) return false;
  return fs.readFileSync(source).equals(fs.readFileSync(destination));
}

function installGuide({ sourceBasename, targetBasename }) {
  const destination = analyzerDir();
  fs.mkdirSync(destination, { recursive: true });

  const source = path.join(ROOT, "m4l_device", sourceBasename);
  if (!fs.existsSync(source)) {
    throw new Error(`Build guide is missing ${source}`);
  }

  const target = path.join(destination, targetBasename);

  const copied = [];
  if (!filesEqual(source, target)) {
    fs.copyFileSync(source, target);
    copied.push(targetBasename);
  }

  return {
    destination,
    changed: copied.length > 0,
    copied,
    files: [targetBasename],
  };
}

function installBuildGuide() {
  return installGuide({
    sourceBasename: "BUILD_GUIDE.md",
    targetBasename: "LivePilot_Analyzer_BUILD_GUIDE.md",
  });
}

function installMidiToolBuildGuide() {
  return installGuide({
    sourceBasename: "MIDITOOL_BUILD_GUIDE.md",
    targetBasename: "LivePilot_MIDI_Tool_BUILD_GUIDE.md",
  });
}

module.exports = {
  analyzerDir,
  defaultAnalyzerDir,
  installBuildGuide,
  installMidiToolBuildGuide,
};

