.PHONY: install serve

install:
	gem install bundler
	bundle update
	bundle install
	npm install

serve:
	bundle exec jekyll serve
