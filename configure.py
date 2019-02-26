#!/usr/bin/env python3

import shutil, os, argparse, sys, stat
sys.path.append("scripts/pyUtils")
sys.path.append("scripts/setUpScripts")
from utils import Utils
from genFuncs import genHelper
def main():
    name = "seqServer"
    libs = "njhseq:v2.6.2,restbed:4.6"
    args = genHelper.parseNjhConfigureArgs()
    cmd = genHelper.mkConfigCmd(name, libs, sys.argv)
    Utils.run(cmd)
    
main()

