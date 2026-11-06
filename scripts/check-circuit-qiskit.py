import contextlib, io, json, sys
import numpy as np
with open(sys.argv[1]) as file:
    examples = json.load(file)
for example in examples:
    scope = {}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(example["code"], scope)
    expected = np.array([complex(*a) for a in example["expected"]])
    actual = np.asarray(scope["state"].data)
    assert np.allclose(actual, expected, atol=1e-10), example["name"]
print(f"PASS QISKIT: {len(examples)} gates and inverses match independently computed statevectors, including phases and wire ordering.")
