ZIP = /usr/bin/zip
NAME = protonmail-checker
PATH = ../

.PHONY: all

all:
	(cd $(PATH) && $(ZIP) -r -9 $(NAME).zip $(NAME) -x '$(NAME)/.git/*' \
		-x $(NAME)/.gitignore -x $(NAME)/Makefile -x $(NAME)/README.md)
