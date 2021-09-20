import multiprocessing
import sys
import os
import io

if __name__ == '__main__':
    multiprocessing.freeze_support()
    script = sys.argv[1]
    wd = os.path.dirname(script)
    sys.path.append(wd)
    sys.argv.pop(0)
    sys.stdout = io.TextIOWrapper(open(sys.stdout.fileno(), 'wb', 0), encoding='utf-8', write_through=True)
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "1"
    exec(open(script, "r", encoding='utf-8').read(), globals(), locals())
