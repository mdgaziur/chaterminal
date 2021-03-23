#!/usr/bin/env python3
import os
from shutil import rmtree, copytree
from os.path import join
from subprocess import Popen, PIPE
import shlex
from platform import uname

if(uname().system.lower() != 'linux'):
    print('Only linux is supported!')
    exit(1)

BUILD_COMMAND = shlex.split("yarn tsc")
CHMOD_COMMAND = shlex.split(f"chmod +x /usr/bin/chaterminal")
RUNNER_APP = f'''#!/usr/bin/env node
require("{("/usr/bin/Chaterminal")}")
'''
if os.geteuid() != 0:
    print("Root access is required!")
    exit(1)

print("Welcome to the installer")
# check for existing installation
if(os.path.exists(("/usr/bin/Chaterminal")) or os.path.exists("/usr/bin/chaterminal")):
    print("A previous installation was found do you want to continue?(Will terminate the installer if yes)?")
    i = input()
    if(i.startswith('Y') or i.startswith('y')):
        print("Removing the previous installation...")
        try:
            rmtree(("/usr/bin/Chaterminal"))
        except:
            pass
        try:
            os.remove("/usr/bin/chaterminal")
        except:
            pass
    else:
        print("Bye")
        exit(0)
print("Checking for yarn...")

try:
    Popen(["yarn", "--help"], stderr=PIPE, stdout=PIPE)
except FileNotFoundError:
    print("Yarn is not installed! Install that and run this installer again")
    exit(1)

print("Checking for nodejs...")

try:
    Popen(["node", "--help"], stderr=PIPE, stdout=PIPE)
except FileNotFoundError:
    print("NodeJS is not installed! Install that and run this installer again")
    exit(1)

print("Installing Chaterminal...")
print("Installing dependencies...")
depInstallProcess = Popen(["yarn"], stdout=PIPE, stderr=PIPE)
depInstallProcess.wait()

if depInstallProcess.returncode != 0:
    print("Error occured while installing dependencies!")
    print(depInstallProcess.stdout.read().decode())
    print(depInstallProcess.stderr.read().decode())
    exit(1)

print("Compiling Chaterminal...")

if(os.path.exists("./build")):
    rmtree("./build")
buildProcess = Popen(BUILD_COMMAND, stdout=PIPE, stderr=PIPE)
buildProcess.wait()

if buildProcess.returncode != 0:
    print("Error occured while executing yarn with tsc!")
    print(buildProcess.stdout.read().decode())
    print(buildProcess.stderr.read().decode())
    exit(1)

print("Copying compiled files to install directory...")

copytree("build", ("/usr/bin/Chaterminal"))

print("Copying executable files to install directory")
with open('/usr/bin/chaterminal', "w") as fp:
    fp.write(RUNNER_APP)

print("Making file executable...")

chmodProcess = Popen(CHMOD_COMMAND, stdout=PIPE, stderr=PIPE)
chmodProcess.wait()

if chmodProcess.returncode != 0:
    print("Error occured while making file executable!")
    print(chmodProcess.stdout.read().decode())
    print(chmodProcess.stderr.read().decode())
    exit(1)

print("Copying dependencies to install directory...")
copytree('./node_modules', ("/usr/bin/Chaterminal/node_modules"))