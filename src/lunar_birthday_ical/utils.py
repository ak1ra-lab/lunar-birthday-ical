import logging


def get_logger(levelname=logging.INFO):
    logging.basicConfig(
        format="[%(asctime)s][%(name)s][%(levelname)s] %(message)s", level=levelname
    )
    logger = logging.getLogger(__name__)

    return logger
