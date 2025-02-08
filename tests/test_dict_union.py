def test_dict_union_operator():
    dict1 = {"a": 1, "b": 2}
    dict2 = {"b": 3, "c": 4}

    result = dict1 | dict2

    assert result == {"a": 1, "b": 3, "c": 4}


def test_dict_union_operator_with_empty_dict():
    dict1 = {"a": 1, "b": 2}
    dict2 = {}

    result = dict1 | dict2

    assert result == {"a": 1, "b": 2}


def test_dict_union_operator_with_overlapping_keys():
    dict1 = {"a": 1, "b": 2}
    dict2 = {"b": 3, "a": 4}

    result = dict1 | dict2

    assert result == {"a": 4, "b": 3}


def test_dict_union_operator_with_nested_dicts():
    dict1 = {"a": {"x": 1}, "b": {"y": 2}}
    dict2 = {"b": {"y": 3}, "c": {"z": 4}}

    result = dict1 | dict2

    assert result == {"a": {"x": 1}, "b": {"y": 3}, "c": {"z": 4}}


def test_dict_union_operator_with_mixed_types():
    dict1 = {"a": 1, "b": [2, 3], "c": {"x": 4}}
    dict2 = {"b": [5, 6], "c": {"y": 7}, "d": 8}

    result = dict1 | dict2

    assert result == {"a": 1, "b": [5, 6], "c": {"y": 7}, "d": 8}


def test_dict_union_operator_with_sub_component_overlapping_keys():
    dict1 = {"a": {"x": 1}, "b": {"y": 2}}
    dict2 = {"b": {"y": 3, "z": 4}, "c": {"w": 5}}

    result = dict1 | dict2

    assert result == {"a": {"x": 1}, "b": {"y": 3, "z": 4}, "c": {"w": 5}}
