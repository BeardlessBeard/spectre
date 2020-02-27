#!/usr/bin/env python3

with open('demo.cpp', 'r') as f:
    contents = f.read()

lines = contents.split('\n')

with open('demo2.cpp', 'w') as f:
    for line in lines:
        line = line.split(' ')
        lineStr = ''
        for string in line[1:]:
            lineStr += string + ' '
        f.write(lineStr + '\n')


