.PHONY: install serve

install:
	rvm install 2.7
	gem install bundler
	bundle update
	bundle install
	npm install

serve:
	rvm use 2.7
	bundle exec jekyll serve --drafts

lighthouse:
	npx lighthouse --view http://localhost:4000
