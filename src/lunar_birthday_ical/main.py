#!/usr/bin/env python3
# author: ak1ra
# date: 2025-01-24

import argparse
import time

from pathlib import Path

from lunar_python import Lunar, Solar

from lunar_birthday_ical.ical import create_calendar
from lunar_birthday_ical.utils import get_logger

logger = get_logger(__name__)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate iCal events and reminders for lunar birthday and cycle days."
    )
    parser.add_argument(
        "config_files",
        type=Path,
        nargs="*",
        metavar="config.yaml",
        help="config file for iCal, checkout config/example-lunar-birthday.yaml for example.",
    )

    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "-L",
        "--lunar-to-solar",
        type=int,
        nargs=3,
        metavar=("YYYY", "MM", "DD"),
        help="Convert lunar date to solar date, add minus sign before leap lunar month.",
    )
    group.add_argument(
        "-S",
        "--solar-to-lunar",
        type=int,
        nargs=3,
        metavar=("YYYY", "MM", "DD"),
        help="Convert solar date to lunar date.",
    )

    args = parser.parse_args()

    if args.lunar_to_solar:
        lunar = Lunar.fromYmd(*args.lunar_to_solar)
        solar = lunar.getSolar()
        logger.info("Lunar date %s is Solar %s", lunar.toString(), solar.toString())
        return

    if args.solar_to_lunar:
        solar = Solar.fromYmd(*args.solar_to_lunar)
        lunar = solar.getLunar()
        logger.info("Solar date %s is Lunar %s", solar.toString(), lunar.toString())
        return

    if len(args.config_files) == 0:
        parser.print_help()
        parser.exit()

    for config_file in args.config_files:
        start = time.perf_counter()
        create_calendar(Path(config_file))
        elapsed = time.perf_counter() - start
        logger.debug("iCal generation elapsed at %.6fs", elapsed)


if __name__ == "__main__":
    main()
