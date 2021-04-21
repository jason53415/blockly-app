import sys
import os

if __name__ == '__main__':
    multiprocessing.freeze_support()
    script = sys.argv[1]
    wd = os.path.dirname(script)
    sys.path.append(wd)
    sys.argv.pop(0)
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "1"
    exec(open(script, "r", encoding='utf8').read(), globals(), locals())
